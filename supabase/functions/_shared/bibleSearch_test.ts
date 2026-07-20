import {
  assertEquals,
} from "https://deno.land/std@0.190.0/testing/asserts.ts";
import {
  extractSingleVerseFromPassageContent,
  isSingleVerseReference,
  selectBibleSearchCandidate,
} from "./bibleSearch.ts";

Deno.test("single-verse references are distinguished from passage ranges", () => {
  assertEquals(isSingleVerseReference("Isaiah 60: 22"), true);
  assertEquals(isSingleVerseReference("Matthew 6:25-34"), false);
});

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

Deno.test("a single verse can be extracted from an API.Bible grouped passage", () => {
  const groupedPassage =
    '<p><span class="v" data-number="21">21</span> Previous verse.</p>' +
    '<p><span class="v" data-number="22">22</span> The least of you will become a thousand.</p>';

  assertEquals(
    extractSingleVerseFromPassageContent(groupedPassage, "Isaiah 60:22"),
    "The least of you will become a thousand.</p>",
  );
});

Deno.test("grouped passage extraction stops before the next verse", () => {
  const groupedPassage =
    '<p><span data-number="21" class="v">21</span> Requested verse. ' +
    '<span data-number="22" class="v">22</span> Next verse.</p>';

  assertEquals(
    extractSingleVerseFromPassageContent(groupedPassage, "Psalm 23:21"),
    "Requested verse.",
  );
});

Deno.test("verse-range lookup continues to return a passage", () => {
  const passage = {
    reference: "Matthew 6:25-34",
    content: "The requested passage.",
  };

  const result = selectBibleSearchCandidate({ passages: [passage] }, "Matthew 6:25-34");

  assertEquals(result, { kind: "passage", value: passage });
});
