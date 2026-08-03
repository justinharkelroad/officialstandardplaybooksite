import type { Database } from "@/integrations/supabase/types";

export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type NoteFolder = Database["public"]["Tables"]["note_folders"]["Row"];
export type NoteUpdate = Database["public"]["Tables"]["notes"]["Update"];
export type NoteView = "recent" | "all" | "favorites" | "folder" | "trash";
