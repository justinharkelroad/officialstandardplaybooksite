import { assertEquals } from "jsr:@std/assert@1";
import { ghlLeadPayload, metaEventName, parseRequest, summarizeVsl, vslTag } from "./logic.ts";

const ids = { event_id: "0123456789abcdef", visitor_id: "fedcba9876543210fedcba9876543210" };

Deno.test("milestones get their own Meta event names", () => {
  assertEquals(metaEventName("vsl_milestone", "35"), "vsl_milestone_35");
  assertEquals(metaEventName("vsl_milestone", "100"), "vsl_milestone_100");
  assertEquals(metaEventName("lead", null), "Lead");
  assertEquals(metaEventName("vsl_reveal", "165"), "vsl_reveal");
});

Deno.test("rejects unknown events and malformed ids", () => {
  assertEquals(parseRequest({ ...ids, action: "event", event: "drop_table" }), "Unknown event");
  assertEquals(parseRequest({ ...ids, event_id: "not-hex", action: "event", event: "vsl_play" }), "Invalid event_id");
  assertEquals(parseRequest({ ...ids, action: "nope" }), "Unknown action");
  assertEquals(parseRequest(null), "Body must be a JSON object");
});

Deno.test("parses an event and drops a bad email", () => {
  const parsed = parseRequest({
    ...ids,
    action: "event",
    event: "vsl_milestone",
    video_id: "sp-main",
    value: 35,
    email: "not an email",
    utm: { utm_source: "facebook", evil: "x" },
  });
  if (typeof parsed === "string") throw new Error(parsed);
  assertEquals(parsed.action, "event");
  assertEquals(parsed.email, null);
  assertEquals(parsed.utm, { utm_source: "facebook" });
  if (parsed.action === "event") assertEquals(parsed.value, "35");
});

Deno.test("a lead needs an email", () => {
  assertEquals(
    parseRequest({ ...ids, action: "lead", lead: { kind: "quiz", contact: { name: "A" } } }),
    "A valid email is required",
  );
});

Deno.test("a lead carries the text me box only when it was ticked", () => {
  const lead = (textOk: unknown) => {
    const parsed = parseRequest({ ...ids, action: "lead", lead: { kind: "quiz", contact: { email: "a@b.test", phone: "2605550100", textOk } } });
    return typeof parsed === "string" ? parsed : parsed.action === "lead" ? parsed.lead.text_ok : "not a lead";
  };
  assertEquals(lead(true), true);
  assertEquals(lead(false), false);
  assertEquals(lead("yes"), false);
  assertEquals(lead(undefined), false);
});

Deno.test("lead payload flattens answers for GHL", () => {
  const parsed = parseRequest({
    ...ids,
    action: "lead",
    lead: {
      kind: "quiz",
      contact: { name: "Dan Westrick", email: "DAN@Example.com", phone: "(260) 555-0100", agency: "Westrick" },
      answers: { producers: "4-9", problem: "team" },
      prescription: "teamStandard2x",
      alternative: "boardroom",
    },
    utm: { utm_campaign: "launch" },
  });
  if (typeof parsed === "string" || parsed.action !== "lead") throw new Error(String(parsed));
  const body = ghlLeadPayload(parsed, { "sp-main": { max_milestone: 35, revealed: true, unmuted: true } });
  assertEquals(body.email, "dan@example.com");
  assertEquals(body.first_name, "Dan");
  assertEquals(body.last_name, "Westrick");
  assertEquals(body.answer_producers, "4-9");
  assertEquals(body.utm_campaign, "launch");
  assertEquals(body.type, "funnel_quiz");
});

Deno.test("summarizes VSL history and tags", () => {
  const summary = summarizeVsl([
    { event: "vsl_milestone", video_id: "sp-main", value: "25" },
    { event: "vsl_milestone", video_id: "sp-main", value: "35" },
    { event: "vsl_reveal", video_id: "sp-main", value: "165" },
  ]);
  assertEquals(summary["sp-main"], { max_milestone: 35, revealed: true, unmuted: false });
  assertEquals(vslTag({ event: "vsl_milestone", videoId: "sp-main", value: "35" }), "vsl sp-main watched 35%");
});

Deno.test("lead email escapes visitor input and lists the answers", async () => {
  const { escapeHtml } = await import("../_shared/email-template.ts");
  const { leadNotification } = await import("./logic.ts");
  const parsed = parseRequest({
    ...ids,
    action: "lead",
    url: "https://standardplaybook.com/book",
    utm: { utm_source: "facebook", utm_campaign: "launch" },
    lead: {
      kind: "booking",
      contact: { name: "Dan <script>alert(1)</script>", email: "dan@example.com", phone: "(260) 555-0100", agency: "Westrick & Co" },
      prescription: "teamStandard2x",
      offer: "teamStandard2x",
      route: "buy",
      summary: {
        prescriptionName: "Team Standard 2X",
        offerName: "Team Standard 2X",
        routeLabel: "Booking form: shown checkout for Team Standard 2X, no call needed",
        answers: [{ question: "How many producers do you have?", answer: "4–9" }],
      },
    },
  });
  if (typeof parsed === "string" || parsed.action !== "lead") throw new Error(String(parsed));
  const n = leadNotification(parsed, { "sp-main": { max_milestone: 35, revealed: true, unmuted: true } }, escapeHtml);
  assertEquals(n.subject, "New Booking Lead: Dan <script>alert(1)</script> (Team Standard 2X)");
  assertEquals(n.title.includes("<script>"), false);
  assertEquals(n.bodyHtml.includes("<script>"), false);
  assertEquals(n.bodyHtml.includes("Westrick &amp; Co"), true);
  assertEquals(n.bodyHtml.includes("How many producers do you have?"), true);
  assertEquals(n.bodyHtml.includes("watched 35%, reached the menu"), true);
  assertEquals(n.bodyHtml.includes("tel:2605550100"), true);
});
