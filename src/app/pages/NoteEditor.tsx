import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlertCircle,
  ArrowLeft,
  Bold,
  Check,
  Cloud,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  MoreHorizontal,
  Quote,
  Redo2,
  Star,
  Strikethrough,
  Trash2,
  Underline,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/app/hooks/use-toast";
import { useNotes } from "@/app/hooks/useNotes";
import type { Json } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

interface NoteDraft {
  title: string;
  body: Json;
  body_text: string;
}

function draftSignature(draft: NoteDraft): string {
  return JSON.stringify(draft);
}

export default function NoteEditor() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { notes, folders, isLoading, isError, refetch, updateNote } = useNotes();
  const note = notes.find((item) => item.id === noteId);
  const [title, setTitle] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [revision, setRevision] = useState(0);
  const [trashOpen, setTrashOpen] = useState(false);
  const [initializedNoteId, setInitializedNoteId] = useState<string | null>(null);
  const draftRef = useRef<NoteDraft | null>(null);
  const savedSignatureRef = useRef("");
  const saveInFlightRef = useRef<Promise<unknown> | null>(null);
  const mountedRef = useRef(true);
  const flushSaveRef = useRef<() => Promise<boolean>>(async () => true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    document.title = `${title.trim() || "Untitled note"} | Standard Playbook`;
    return () => {
      document.title = "Standard Playbook";
    };
  }, [title]);

  useEffect(() => {
    if (!note || initializedNoteId === note.id) return;
    const initialDraft: NoteDraft = {
      title: note.title,
      body: note.body,
      body_text: note.body_text,
    };
    draftRef.current = initialDraft;
    savedSignatureRef.current = draftSignature(initialDraft);
    setTitle(note.title);
    setSaveStatus("saved");
    setInitializedNoteId(note.id);
  }, [initializedNoteId, note]);

  const flushSave = useCallback(async (): Promise<boolean> => {
    if (!noteId || !draftRef.current) return true;

    if (saveInFlightRef.current) {
      try {
        await saveInFlightRef.current;
      } catch {
        return false;
      }
    }

    const draft = draftRef.current;
    const signature = draftSignature(draft);
    if (signature === savedSignatureRef.current) {
      if (mountedRef.current) setSaveStatus("saved");
      return true;
    }

    if (mountedRef.current) setSaveStatus("saving");
    const request = updateNote(noteId, draft);
    saveInFlightRef.current = request;
    try {
      await request;
      savedSignatureRef.current = signature;
      const hasNewerChanges = draftRef.current
        ? draftSignature(draftRef.current) !== signature
        : false;
      if (mountedRef.current) setSaveStatus(hasNewerChanges ? "unsaved" : "saved");
      if (hasNewerChanges) return flushSave();
      return true;
    } catch (error) {
      console.error("Unable to save note", error);
      if (mountedRef.current) setSaveStatus("error");
      return false;
    } finally {
      if (saveInFlightRef.current === request) saveInFlightRef.current = null;
    }
  }, [noteId, updateNote]);

  useEffect(() => {
    flushSaveRef.current = flushSave;
  }, [flushSave]);

  useEffect(() => {
    return () => {
      void flushSaveRef.current();
    };
  }, []);

  useEffect(() => {
    if (revision === 0 || saveStatus === "saved") return;
    const timer = window.setTimeout(() => {
      void flushSave();
    }, 800);
    return () => window.clearTimeout(timer);
  }, [flushSave, revision, saveStatus]);

  useEffect(() => {
    const handlePageHide = () => {
      void flushSave();
    };
    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [flushSave]);

  const markDraftChanged = () => {
    setSaveStatus("unsaved");
    setRevision((current) => current + 1);
  };

  const handleTitleChange = (nextTitle: string) => {
    setTitle(nextTitle);
    if (!draftRef.current) return;
    draftRef.current = { ...draftRef.current, title: nextTitle };
    markDraftChanged();
  };

  const handleBodyChange = useCallback((body: Json, bodyText: string) => {
    if (!draftRef.current) return;
    draftRef.current = { ...draftRef.current, body, body_text: bodyText };
    markDraftChanged();
  }, []);

  const handleBack = async () => {
    const saved = await flushSave();
    if (!saved) {
      toast({
        title: "Note not saved",
        description: "Stay here and try saving again before leaving.",
        variant: "destructive",
      });
      return;
    }
    navigate("/app/notes");
  };

  const handleFolderChange = async (folderId: string | null) => {
    if (!note) return;
    if (!(await flushSave())) return;
    try {
      await updateNote(note.id, { folder_id: folderId });
    } catch (error) {
      console.error("Unable to move note", error);
      toast({ title: "Note not moved", description: "Please try again.", variant: "destructive" });
    }
  };

  const handleFavorite = async () => {
    if (!note) return;
    try {
      await updateNote(note.id, { is_favorite: !note.is_favorite });
    } catch (error) {
      console.error("Unable to update favorite", error);
      toast({ title: "Favorite not updated", description: "Please try again.", variant: "destructive" });
    }
  };

  const handleTrash = async () => {
    if (!note) return;
    if (!(await flushSave())) return;
    try {
      await updateNote(note.id, { deleted_at: new Date().toISOString() });
      navigate("/app/notes");
      toast({ title: "Moved to Trash", description: "You can restore this note from Trash." });
    } catch (error) {
      console.error("Unable to move note to trash", error);
      toast({ title: "Note not moved", description: "Nothing was deleted. Please try again.", variant: "destructive" });
    }
  };

  if (isLoading || (note && initializedNoteId !== note.id)) return <NoteEditorSkeleton />;

  if (isError) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center border-[1.5px] border-foreground bg-card px-6 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <h1 className="sp-display mt-4 text-2xl">Note could not load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your note is still safe. Check your connection and try again.</p>
        <Button type="button" variant="outline" onClick={() => void refetch()} className="mt-5 rounded-none">Try again</Button>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center border-[1.5px] border-foreground bg-card px-6 text-center">
        <h1 className="sp-display text-2xl">Note not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">It may have been permanently deleted.</p>
        <Button type="button" onClick={() => navigate("/app/notes")} className="mt-5 rounded-none">Back to Notes</Button>
      </div>
    );
  }

  if (note.deleted_at) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center border-[1.5px] border-foreground bg-card px-6 text-center">
        <Trash2 className="h-8 w-8 text-muted-foreground" />
        <h1 className="sp-display mt-4 text-2xl">This note is in Trash</h1>
        <p className="mt-2 text-sm text-muted-foreground">Restore it from the Notes page before editing.</p>
        <Button type="button" onClick={() => navigate("/app/notes")} className="mt-5 rounded-none">Back to Notes</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-w-0 max-w-[900px]">
      <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-3 border-b-[1.5px] border-foreground pb-4">
        <button
          type="button"
          onClick={() => void handleBack()}
          className="sp-label flex h-10 items-center gap-2 text-[10px] text-foreground/60 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Notes
        </button>
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <SaveIndicator status={saveStatus} onRetry={() => void flushSave()} />
          <label htmlFor="note-folder" className="sr-only">Note folder</label>
          <select
            id="note-folder"
            value={note.folder_id ?? "general"}
            onChange={(event) => void handleFolderChange(event.target.value === "general" ? null : event.target.value)}
            className="h-10 max-w-[150px] border border-foreground/25 bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-[#2997FF] sm:max-w-[190px]"
          >
            <option value="general">General</option>
            {folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
          </select>
          <button
            type="button"
            onClick={() => void handleFavorite()}
            aria-label={note.is_favorite ? "Remove from favorites" : "Add to favorites"}
            className="flex h-10 w-10 items-center justify-center text-foreground/50 transition-colors hover:text-[#2997FF]"
          >
            <Star className={cn("h-4 w-4", note.is_favorite && "fill-[#2997FF] text-[#2997FF]")} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" aria-label="Note options" className="flex h-10 w-10 items-center justify-center text-foreground/50 transition-colors hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-none">
              <DropdownMenuItem onSelect={() => void handleFavorite()}>
                <Star className="mr-2 h-4 w-4" /> {note.is_favorite ? "Remove favorite" : "Add favorite"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setTrashOpen(true)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Move to Trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border-[1.5px] border-foreground bg-card">
        <div className="border-b border-foreground/15 px-5 py-5 sm:px-8 sm:py-7">
          <label htmlFor="note-title" className="sr-only">Note title</label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(event) => handleTitleChange(event.target.value)}
            placeholder="Untitled note"
            maxLength={200}
            className="sp-display block h-12 w-full min-w-0 bg-transparent text-3xl leading-tight text-foreground outline-none placeholder:text-foreground/25 sm:text-4xl"
          />
        </div>
        <NoteRichTextEditor key={note.id} initialBody={note.body} onChange={handleBodyChange} />
      </div>

      <p className="mt-3 text-right text-[10px] text-muted-foreground">Changes save automatically.</p>

      <AlertDialog open={trashOpen} onOpenChange={setTrashOpen}>
        <AlertDialogContent className="rounded-none border-[1.5px] border-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="sp-display">Move this note to Trash?</AlertDialogTitle>
            <AlertDialogDescription>You can restore it later from the Notes page.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleTrash()} className="rounded-none bg-destructive text-destructive-foreground">Move to Trash</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SaveIndicator({ status, onRetry }: { status: SaveStatus; onRetry: () => void }) {
  const config = {
    saved: { icon: Check, label: "Saved", className: "text-foreground/45" },
    saving: { icon: Cloud, label: "Saving", className: "text-foreground/45" },
    unsaved: { icon: Cloud, label: "Unsaved", className: "text-foreground/55" },
    error: { icon: AlertCircle, label: "Save failed", className: "text-destructive" },
  }[status];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={status === "error" ? onRetry : undefined}
      className={cn("sp-label flex h-10 items-center gap-1.5 px-2 text-[9px]", config.className, status !== "error" && "cursor-default")}
      aria-live="polite"
    >
      <Icon className={cn("h-3.5 w-3.5", status === "saving" && "animate-pulse")} />
      <span className="hidden sm:inline">{config.label}</span>
    </button>
  );
}

function NoteRichTextEditor({ initialBody, onChange }: { initialBody: Json; onChange: (body: Json, bodyText: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "text-[#0066CC] underline underline-offset-2 dark:text-[#65B5FF]" },
      }),
      Placeholder.configure({ placeholder: "Start writing..." }),
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialBody as unknown as JSONContent,
    editorProps: {
      attributes: {
        class: "sp-note-editor min-h-[440px] px-5 py-6 outline-none sm:min-h-[520px] sm:px-8 sm:py-8",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON() as Json, currentEditor.getText({ blockSeparator: "\n" }));
    },
  });

  const addLink = () => {
    if (!editor) return;
    const currentHref = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Paste a link", currentHref ?? "https://");
    if (href === null) return;
    if (!href.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  };

  if (!editor) return <div className="min-h-[520px] animate-pulse bg-foreground/[0.03]" />;

  return (
    <div>
      <div className="sticky top-14 z-20 flex flex-wrap items-center gap-0.5 border-b border-foreground/15 bg-card/95 px-2 py-2 backdrop-blur sm:px-4">
        <EditorButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo2} />
        <EditorButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo2} />
        <EditorDivider />
        <EditorButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} icon={Bold} />
        <EditorButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} icon={Italic} />
        <EditorButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} icon={Underline} />
        <EditorButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} icon={Strikethrough} />
        <EditorDivider />
        <EditorButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} icon={Heading2} />
        <EditorButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} icon={Heading3} />
        <EditorButton label="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} icon={List} />
        <EditorButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} icon={ListOrdered} />
        <EditorButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} icon={Quote} />
        <EditorDivider />
        <EditorButton label="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} icon={AlignLeft} />
        <EditorButton label="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} icon={AlignCenter} />
        <EditorButton label="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} icon={AlignRight} />
        <EditorButton label="Highlight" active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()} icon={Highlighter} />
        <EditorButton label="Link" active={editor.isActive("link")} onClick={addLink} icon={LinkIcon} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

interface EditorButtonProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

function EditorButton({ label, icon: Icon, onClick, active = false, disabled = false }: EditorButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center transition-colors disabled:opacity-25",
        active ? "bg-foreground text-background" : "text-foreground/55 hover:bg-foreground/[0.06] hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function EditorDivider() {
  return <span aria-hidden className="mx-1 h-5 w-px bg-foreground/15" />;
}

function NoteEditorSkeleton() {
  return (
    <div className="mx-auto max-w-[900px] animate-pulse">
      <div className="mb-4 h-10 border-b-[1.5px] border-foreground/20" />
      <div className="min-h-[620px] border-[1.5px] border-foreground/20 bg-card p-8">
        <div className="h-10 w-2/3 bg-foreground/10" />
        <div className="mt-16 h-3 w-full bg-foreground/10" />
        <div className="mt-3 h-3 w-5/6 bg-foreground/10" />
        <div className="mt-3 h-3 w-3/4 bg-foreground/10" />
      </div>
    </div>
  );
}
