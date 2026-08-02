/// <reference lib="dom" />
// The encoder under test is browser code and touches document, so the DOM lib
// is pulled in explicitly rather than suppressing type checking with --no-check.
/**
 * Contract test across the domain boundary.
 *
 * The browser encoder in src/lib/metaCheckout.ts and the decoder here are two
 * halves of one wire format that travels through Stripe. They live in
 * different runtimes and cannot share a module, so this test imports both and
 * proves they still agree.
 *
 * Run: deno test --allow-env --no-lock tests/meta-capi.test.ts
 *
 * Deliberately outside supabase/functions so no bundler can mistake a test for
 * deployable edge-function source.
 */

import { assert, assertEquals } from "jsr:@std/assert@1";
import { encodeClientReference } from "../src/lib/metaCheckout.ts";
import { decodeClientReference, sendMetaPurchaseEvent, sha256Hex } from "../supabase/functions/_shared/meta-capi.ts";

const EVENT_ID = "fee525484d014065a74d4ce8519a692a";

Deno.test("round trips both cookies", () => {
  const fbp = "fb.1.1596403881668.1116446470";
  const fbc = "fb.1.1554763741205.IwAR0test-abc_defGHIjklMNOpqrs123456";
  const decoded = decodeClientReference(encodeClientReference(EVENT_ID, fbp, fbc));
  assertEquals(decoded, { eventId: EVENT_ID, fbp, fbc });
});

Deno.test("still decodes v1, so clicks made before the v2 deploy convert", () => {
  // Captured from an actual click on /aiinstall, not hand written.
  const real =
    "v1-fee525484d014065a74d4ce8519a692a-1596403881668-1116446470-1554763741205-IwAR0test-abc_defGHIjklMNOpqrs123456";
  const decoded = decodeClientReference(real);
  assertEquals(decoded?.eventId, EVENT_ID);
  assertEquals(decoded?.fbp, "fb.1.1596403881668.1116446470");
  assertEquals(decoded?.fbc, "fb.1.1554763741205.IwAR0test-abc_defGHIjklMNOpqrs123456");
});

Deno.test("preserves dashes inside fbclid", () => {
  const fbc = "fb.1.1554763741205.a-b-c-d-e_f-g";
  const decoded = decodeClientReference(
    encodeClientReference(EVENT_ID, "fb.1.1596403881668.1116446470", fbc),
  );
  assertEquals(decoded?.fbc, fbc);
});

Deno.test("survives missing cookies and still yields the event id", () => {
  const decoded = decodeClientReference(encodeClientReference(EVENT_ID, null, null));
  assertEquals(decoded?.eventId, EVENT_ID);
  assertEquals(decoded?.fbp, null);
  assertEquals(decoded?.fbc, null);
});

Deno.test("negative controls: junk must not decode", () => {
  for (const bad of [null, undefined, "", "abc", "v2-x-1-2-3-4", "v1-tooshort"]) {
    assertEquals(decodeClientReference(bad as string | null), null, `decoded: ${bad}`);
  }
  // A non-hex event id is not ours.
  assertEquals(decodeClientReference("v1-ZZZZ-1-2-3-4"), null);
});

Deno.test("keeps _fbc for a real production Meta cookie", () => {
  // This exact fbclid was read off standardplaybook.com in a live browser. It
  // is 144 characters, which overflowed the v1 encoding at 227 and caused _fbc
  // to be dropped on precisely the ad-driven clicks it exists to attribute.
  const fbclid =
    "PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGnPmNG2ZrrpwIsb4pJjIKk0MY75gZ90WFCvW8HWt45rqVlNBDo2Bi4QOXpXnI_aem_6ccozZV5xyhXwty1KhuqtQ";
  const fbp = "fb.1.1777808168246.147449278455439365";
  const fbc = `fb.1.1781392390626.${fbclid}`;

  const ref = encodeClientReference("fee525484d014065", fbp, fbc);
  assert(ref.length <= 200, `length ${ref.length} exceeds Stripe's ceiling`);

  const decoded = decodeClientReference(ref);
  assertEquals(decoded?.fbp, fbp, "_fbp must survive");
  assertEquals(decoded?.fbc, fbc, "_fbc must survive on a real cookie");
});

Deno.test("stays inside Stripe's charset and length limit", () => {
  const ref = encodeClientReference(
    EVENT_ID,
    "fb.1.1596403881668.1116446470",
    "fb.1.1554763741205." + "X-".repeat(120),
  );
  assert(ref.length <= 200, `length ${ref.length}`);
  assert(/^[A-Za-z0-9_-]+$/.test(ref), `charset violation: ${ref}`);
  // An oversized fbc is dropped whole, never truncated into garbage.
  assertEquals(decodeClientReference(ref)?.fbc, null);
  assertEquals(decodeClientReference(ref)?.eventId, EVENT_ID);
});

Deno.test("builds a correct Purchase payload and reuses the browser event id", async () => {
  Deno.env.set("META_PIXEL_ID", "1543875540296120");
  Deno.env.set("META_CAPI_TOKEN", "test-token");

  const original = globalThis.fetch;
  let captured: any = null;
  globalThis.fetch = async (_url: any, init: any) => {
    captured = JSON.parse(init.body);
    return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
  };

  try {
    const result = await sendMetaPurchaseEvent({
      email: "  Buyer@Example.COM ",
      fullName: "Jane Q Doe",
      phone: "(260) 555-0134",
      amountTotalCents: 99700,
      currency: "usd",
      clientReferenceId: encodeClientReference(
        EVENT_ID,
        "fb.1.1596403881668.1116446470",
        "fb.1.1554763741205.abc123",
      ),
      eventTime: 1785679000,
      fallbackEventId: "stripe_cs_test",
    });

    assert(result.sent, `not sent: ${result.reason}`);
    assertEquals(result.eventId, EVENT_ID, "must dedupe against the browser event");

    const ev = captured.data[0];
    assertEquals(ev.event_name, "Purchase");
    assertEquals(ev.event_id, EVENT_ID);
    assertEquals(ev.event_time, 1785679000);
    assertEquals(ev.action_source, "website");
    assertEquals(ev.custom_data.value, 997);
    assertEquals(ev.custom_data.currency, "USD");
    assertEquals(ev.user_data.fbp, "fb.1.1596403881668.1116446470");
    assertEquals(ev.user_data.fbc, "fb.1.1554763741205.abc123");

    // Email must be lowercased and trimmed before hashing.
    assertEquals(ev.user_data.em[0], await sha256Hex("buyer@example.com"));
    assertEquals(ev.user_data.fn[0], await sha256Hex("jane"));
    assertEquals(ev.user_data.ln[0], await sha256Hex("doe"));
    assertEquals(ev.user_data.ph[0], await sha256Hex("2605550134"));

    // Raw identifiers must never leave the process.
    const body = JSON.stringify(captured);
    assert(!body.includes("buyer@example.com"), "plaintext email leaked");
    assert(!body.includes("Jane"), "plaintext name leaked");
  } finally {
    globalThis.fetch = original;
  }
});

Deno.test("falls back to the deterministic id when no reference arrived", async () => {
  Deno.env.set("META_PIXEL_ID", "1543875540296120");
  Deno.env.set("META_CAPI_TOKEN", "test-token");

  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ events_received: 1 }), { status: 200 });

  try {
    const result = await sendMetaPurchaseEvent({
      email: "buyer@example.com",
      fallbackEventId: "stripe_cs_abc",
      clientReferenceId: null,
    });
    assertEquals(result.eventId, "stripe_cs_abc");
  } finally {
    globalThis.fetch = original;
  }
});

Deno.test("never throws: missing config, network error, and non-2xx", async () => {
  const original = globalThis.fetch;

  Deno.env.delete("META_PIXEL_ID");
  Deno.env.delete("META_CAPI_TOKEN");
  const unconfigured = await sendMetaPurchaseEvent({
    email: "buyer@example.com",
    fallbackEventId: "stripe_x",
  });
  assertEquals(unconfigured.sent, false);
  assert(unconfigured.reason?.includes("not configured"));

  Deno.env.set("META_PIXEL_ID", "1543875540296120");
  Deno.env.set("META_CAPI_TOKEN", "test-token");

  globalThis.fetch = async () => {
    throw new Error("connection reset");
  };
  const networkFailure = await sendMetaPurchaseEvent({
    email: "buyer@example.com",
    fallbackEventId: "stripe_x",
  });
  assertEquals(networkFailure.sent, false);
  assert(networkFailure.reason?.includes("connection reset"));

  globalThis.fetch = async () =>
    new Response(JSON.stringify({ error: { message: "bad token" } }), { status: 401 });
  const rejected = await sendMetaPurchaseEvent({
    email: "buyer@example.com",
    fallbackEventId: "stripe_x",
  });
  assertEquals(rejected.sent, false);
  assert(rejected.reason?.includes("401"));

  globalThis.fetch = original;
});
