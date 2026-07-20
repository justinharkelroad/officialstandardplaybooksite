import {
  assertEquals,
} from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { selectBibleSearchCandidate } from "./bibleSearch.ts";

Deno.test("single-verse lookup prefers the exact verse over a broad passage", () => {
  const exactVerse = {
    reference: "Isaiah 60:22",
    text: "The exact verse text.",
  };

  const result = selectBibleSearchCandidate({
    passages: [{
      reference: "Isaiah 60:8-22",
      content: "A much longer passage.",
    }],
    verses: [exactVerse],
  }, "Isaiah 60:22");

  assertEquals(result, { kind: "verse", value: exactVerse });
});

Deno.test("single-verse lookup rejects a broad passage fallback", () => {
  const result = selectBibleSearchCandidate({
    passages: [{
      reference: "Isaiah 60:8-22",
      content: "A much longer passage.",
    }],
  }, "Isaiah 60: 22");

  assertEquals(result, null);
});

Deno.test("verse-range lookup continues to return a passage", () => {
  const passage = {
    reference: "Matthew 6:25-34",
    content: "The requested passage.",
  };

  const result = selectBibleSearchCandidate({ passages: [passage] }, "Matthew 6:25-34");

  assertEquals(result, { kind: "passage", value: passage });
});
