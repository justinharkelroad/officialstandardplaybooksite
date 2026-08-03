import type { Json } from "@/integrations/supabase/types";
import type { Note, NoteView } from "@/app/types/notes";

export const EMPTY_NOTE_BODY: Json = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function displayNoteTitle(title: string): string {
  return title.trim() || "Untitled note";
}

export function notePreview(bodyText: string, maxLength = 180): string {
  const normalized = bodyText.replace(/\s+/g, " ").trim();
  if (!normalized) return "No writing yet";
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

interface FilterNotesOptions {
  view: NoteView;
  folderId?: string | null;
  query?: string;
}

export function filterNotes(
  notes: Note[],
  { view, folderId = null, query = "" }: FilterNotesOptions,
): Note[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return notes
    .filter((note) => {
      const isDeleted = note.deleted_at !== null;
      if (view === "trash") return isDeleted;
      if (isDeleted) return false;
      if (view === "favorites" && !note.is_favorite) return false;
      if (view === "folder" && note.folder_id !== folderId) return false;
      return true;
    })
    .filter((note) => {
      if (!normalizedQuery) return true;
      return `${note.title}\n${note.body_text}`.toLocaleLowerCase().includes(normalizedQuery);
    })
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
}
