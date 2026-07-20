export type BibleSearchPassage = {
  id?: string;
  bibleId?: string;
  reference?: string;
  content?: string;
  copyright?: string;
  verseCount?: number;
};

export type BibleSearchVerse = {
  id?: string;
  reference?: string;
  text?: string;
  content?: string;
  copyright?: string;
};

export type BibleSearchCandidate =
  | { kind: "passage"; value: BibleSearchPassage }
  | { kind: "verse"; value: BibleSearchVerse };

type SingleVerseLocation = {
  chapter: number;
  verse: number;
};

function parseSingleVerseLocation(reference: string): SingleVerseLocation | null {
  if (/[-–—,;]/.test(reference)) return null;

  const match = reference.trim().match(/(?:^|\s)(\d+)\s*:\s*(\d+)\s*$/);
  if (!match) return null;

  return {
    chapter: Number(match[1]),
    verse: Number(match[2]),
  };
}

export function isSingleVerseReference(reference: string): boolean {
  return parseSingleVerseLocation(reference) !== null;
}

export function extractSingleVerseFromPassageContent(
  content: string,
  requestedReference: string,
): string | null {
  const requested = parseSingleVerseLocation(requestedReference);
  if (!requested || !content) return null;

  const verseMarker = new RegExp(
    `<span\\b[^>]*\\bdata-number\\s*=\\s*["']${requested.verse}["'][^>]*>[\\s\\S]*?<\\/span>`,
    "i",
  );
  const marker = verseMarker.exec(content);
  if (!marker || marker.index === undefined) return null;

  const verseStart = marker.index + marker[0].length;
  const remainingContent = content.slice(verseStart);
  const nextVerseMarker = /<span\b[^>]*\bdata-number\s*=\s*["']\d+["'][^>]*>/i;
  const nextMarker = nextVerseMarker.exec(remainingContent);
  const verseContent = remainingContent.slice(
    0,
    nextMarker?.index ?? remainingContent.length,
  );

  return verseContent.trim() || null;
}

function matchesSingleVerse(
  candidateReference: string | undefined,
  requested: SingleVerseLocation,
): boolean {
  if (!candidateReference) return false;
  const candidate = parseSingleVerseLocation(candidateReference);
  return candidate?.chapter === requested.chapter && candidate.verse === requested.verse;
}

export function selectBibleSearchCandidate(
  data: {
    passages?: BibleSearchPassage[];
    verses?: BibleSearchVerse[];
  } | undefined,
  requestedReference: string,
): BibleSearchCandidate | null {
  const passages = data?.passages ?? [];
  const verses = data?.verses ?? [];
  const requestedSingleVerse = parseSingleVerseLocation(requestedReference);

  if (requestedSingleVerse) {
    const exactVerse = verses.find((candidate) =>
      Boolean(candidate.text || candidate.content) &&
      matchesSingleVerse(candidate.reference, requestedSingleVerse)
    );
    if (exactVerse) return { kind: "verse", value: exactVerse };

    const exactPassage = passages.find((candidate) =>
      Boolean(candidate.content) &&
      matchesSingleVerse(candidate.reference, requestedSingleVerse)
    );
    return exactPassage ? { kind: "passage", value: exactPassage } : null;
  }

  const passage = passages.find((candidate) =>
    Boolean(candidate.reference && candidate.content)
  );
  if (passage) return { kind: "passage", value: passage };

  const verse = verses.find((candidate) =>
    Boolean(candidate.reference && (candidate.text || candidate.content))
  );
  return verse ? { kind: "verse", value: verse } : null;
}
