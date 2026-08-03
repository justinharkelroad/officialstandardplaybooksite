import assert from "node:assert/strict";
import test from "node:test";
import { displayNoteTitle, filterNotes, notePreview } from "./notes";
import type { Note } from "@/app/types/notes";

const baseNote: Note = {
  id: "note-1",
  user_id: "user-1",
  folder_id: null,
  title: "Weekly review",
  body: { type: "doc" },
  body_text: "Wins and lessons from this week",
  is_favorite: false,
  deleted_at: null,
  created_at: "2026-08-01T12:00:00.000Z",
  updated_at: "2026-08-01T12:00:00.000Z",
};

test("filterNotes keeps deleted notes out of active views", () => {
  const deleted = { ...baseNote, id: "note-2", deleted_at: "2026-08-02T12:00:00.000Z" };
  assert.deepEqual(filterNotes([baseNote, deleted], { view: "all" }).map((note) => note.id), ["note-1"]);
  assert.deepEqual(filterNotes([baseNote, deleted], { view: "trash" }).map((note) => note.id), ["note-2"]);
});

test("filterNotes supports favorites, folders, search, and newest-first sorting", () => {
  const favorite = {
    ...baseNote,
    id: "note-2",
    title: "Body targets",
    body_text: "Training plan and recovery targets",
    folder_id: "folder-1",
    is_favorite: true,
    updated_at: "2026-08-02T12:00:00.000Z",
  };

  assert.deepEqual(filterNotes([baseNote, favorite], { view: "favorites" }).map((note) => note.id), ["note-2"]);
  assert.deepEqual(filterNotes([baseNote, favorite], { view: "folder", folderId: "folder-1" }).map((note) => note.id), ["note-2"]);
  assert.deepEqual(filterNotes([baseNote, favorite], { view: "all", query: "lessons" }).map((note) => note.id), ["note-1"]);
  assert.deepEqual(filterNotes([baseNote, favorite], { view: "recent" }).map((note) => note.id), ["note-2", "note-1"]);
});

test("note display helpers handle empty and long writing", () => {
  assert.equal(displayNoteTitle("   "), "Untitled note");
  assert.equal(notePreview("  "), "No writing yet");
  assert.equal(notePreview("one two three", 7), "one two...");
});
