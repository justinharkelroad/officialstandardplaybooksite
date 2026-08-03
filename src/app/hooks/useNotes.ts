import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/app/lib/supabaseClient";
import { useAuth } from "@/app/lib/auth";
import { EMPTY_NOTE_BODY } from "@/app/lib/notes";
import type { Note, NoteFolder, NoteUpdate } from "@/app/types/notes";

interface NotesData {
  notes: Note[];
  folders: NoteFolder[];
}

const emptyData: NotesData = { notes: [], folders: [] };

export function useNotes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["member-notes", user?.id] as const, [user?.id]);

  const query = useQuery({
    queryKey,
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<NotesData> => {
      const [notesResponse, foldersResponse] = await Promise.all([
        supabase
          .from("notes")
          .select("*")
          .eq("user_id", user!.id)
          .order("updated_at", { ascending: false }),
        supabase
          .from("note_folders")
          .select("*")
          .eq("user_id", user!.id)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
      ]);

      if (notesResponse.error) throw notesResponse.error;
      if (foldersResponse.error) throw foldersResponse.error;

      return {
        notes: notesResponse.data ?? [],
        folders: foldersResponse.data ?? [],
      };
    },
  });

  const updateCache = useCallback(
    (updater: (current: NotesData) => NotesData) => {
      queryClient.setQueryData<NotesData>(queryKey, (current) => updater(current ?? emptyData));
    },
    [queryClient, queryKey],
  );

  const createNote = useCallback(
    async (folderId: string | null = null): Promise<Note> => {
      if (!user?.id) throw new Error("You must be signed in to create a note.");
      const { data, error } = await supabase
        .from("notes")
        .insert({
          user_id: user.id,
          folder_id: folderId,
          title: "Untitled note",
          body: EMPTY_NOTE_BODY,
          body_text: "",
        })
        .select()
        .single();
      if (error) throw error;
      updateCache((current) => ({ ...current, notes: [data, ...current.notes] }));
      return data;
    },
    [updateCache, user?.id],
  );

  const updateNote = useCallback(
    async (noteId: string, patch: NoteUpdate): Promise<Note> => {
      if (!user?.id) throw new Error("You must be signed in to update a note.");
      const { data, error } = await supabase
        .from("notes")
        .update(patch)
        .eq("id", noteId)
        .eq("user_id", user.id)
        .select()
        .single();
      if (error) throw error;
      updateCache((current) => ({
        ...current,
        notes: current.notes.map((note) => (note.id === noteId ? data : note)),
      }));
      return data;
    },
    [updateCache, user?.id],
  );

  const deleteNotePermanently = useCallback(
    async (noteId: string): Promise<void> => {
      if (!user?.id) throw new Error("You must be signed in to delete a note.");
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId)
        .eq("user_id", user.id);
      if (error) throw error;
      updateCache((current) => ({
        ...current,
        notes: current.notes.filter((note) => note.id !== noteId),
      }));
    },
    [updateCache, user?.id],
  );

  const createFolder = useCallback(
    async (name: string): Promise<NoteFolder> => {
      if (!user?.id) throw new Error("You must be signed in to create a folder.");
      const { data, error } = await supabase
        .from("note_folders")
        .insert({ user_id: user.id, name: name.trim() })
        .select()
        .single();
      if (error) throw error;
      updateCache((current) => ({ ...current, folders: [...current.folders, data] }));
      return data;
    },
    [updateCache, user?.id],
  );

  const renameFolder = useCallback(
    async (folderId: string, name: string): Promise<NoteFolder> => {
      if (!user?.id) throw new Error("You must be signed in to rename a folder.");
      const { data, error } = await supabase
        .from("note_folders")
        .update({ name: name.trim() })
        .eq("id", folderId)
        .eq("user_id", user.id)
        .select()
        .single();
      if (error) throw error;
      updateCache((current) => ({
        ...current,
        folders: current.folders.map((folder) => (folder.id === folderId ? data : folder)),
      }));
      return data;
    },
    [updateCache, user?.id],
  );

  const deleteFolder = useCallback(
    async (folderId: string): Promise<void> => {
      if (!user?.id) throw new Error("You must be signed in to delete a folder.");
      const { error } = await supabase
        .from("note_folders")
        .delete()
        .eq("id", folderId)
        .eq("user_id", user.id);
      if (error) throw error;
      updateCache((current) => ({
        folders: current.folders.filter((folder) => folder.id !== folderId),
        notes: current.notes.map((note) => (
          note.folder_id === folderId ? { ...note, folder_id: null } : note
        )),
      }));
    },
    [updateCache, user?.id],
  );

  return {
    ...query,
    notes: query.data?.notes ?? [],
    folders: query.data?.folders ?? [],
    createNote,
    updateNote,
    deleteNotePermanently,
    createFolder,
    renameFolder,
    deleteFolder,
  };
}
