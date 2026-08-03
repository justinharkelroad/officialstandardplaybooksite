import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNowStrict } from "date-fns";
import {
  ArchiveRestore,
  Clock3,
  FilePlus2,
  FileText,
  Folder,
  FolderPlus,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/app/hooks/use-toast";
import { useNotes } from "@/app/hooks/useNotes";
import { displayNoteTitle, filterNotes, notePreview } from "@/app/lib/notes";
import type { Note, NoteFolder, NoteView } from "@/app/types/notes";
import { cn } from "@/lib/utils";

interface FolderDialogState {
  mode: "create" | "rename";
  folder?: NoteFolder;
}

function viewLabel(view: NoteView, folderName?: string): string {
  if (view === "favorites") return "Favorites";
  if (view === "all") return "All notes";
  if (view === "trash") return "Trash";
  if (view === "folder") return folderName ?? "General";
  return "Recent";
}

export default function Notes() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    notes,
    folders,
    isLoading,
    isError,
    refetch,
    createNote,
    updateNote,
    deleteNotePermanently,
    createFolder,
    renameFolder,
    deleteFolder,
  } = useNotes();
  const [view, setView] = useState<NoteView>("recent");
  const [folderId, setFolderId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [folderDialog, setFolderDialog] = useState<FolderDialogState | null>(null);
  const [folderName, setFolderName] = useState("");
  const [folderSaving, setFolderSaving] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<NoteFolder | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  useEffect(() => {
    document.title = "Notes | Standard Playbook";
    return () => {
      document.title = "Standard Playbook";
    };
  }, []);

  const activeFolder = folders.find((folder) => folder.id === folderId);
  const visibleNotes = useMemo(
    () => filterNotes(notes, { view, folderId, query }),
    [folderId, notes, query, view],
  );
  const activeCount = notes.filter((note) => note.deleted_at === null).length;
  const favoriteCount = notes.filter((note) => note.deleted_at === null && note.is_favorite).length;
  const trashCount = notes.filter((note) => note.deleted_at !== null).length;

  const selectView = (nextView: NoteView, nextFolderId: string | null = null) => {
    setView(nextView);
    setFolderId(nextFolderId);
  };

  const handleCreateNote = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const note = await createNote(view === "folder" ? folderId : null);
      navigate(`/app/notes/${note.id}`);
    } catch (error) {
      console.error("Unable to create note", error);
      toast({
        title: "Note not created",
        description: "Your note library was not changed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleFavorite = async (note: Note) => {
    try {
      await updateNote(note.id, { is_favorite: !note.is_favorite });
    } catch (error) {
      console.error("Unable to update favorite", error);
      toast({
        title: "Favorite not updated",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTrash = async (note: Note) => {
    try {
      await updateNote(note.id, { deleted_at: new Date().toISOString() });
      toast({ title: "Moved to Trash", description: "You can restore this note from Trash." });
    } catch (error) {
      console.error("Unable to move note to trash", error);
      toast({
        title: "Note not moved",
        description: "Nothing was deleted. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRestore = async (note: Note) => {
    try {
      await updateNote(note.id, { deleted_at: null });
      toast({ title: "Note restored", description: "The note is back in your library." });
    } catch (error) {
      console.error("Unable to restore note", error);
      toast({
        title: "Note not restored",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMove = async (note: Note, nextFolderId: string | null) => {
    try {
      await updateNote(note.id, { folder_id: nextFolderId });
    } catch (error) {
      console.error("Unable to move note", error);
      toast({
        title: "Note not moved",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const openFolderDialog = (state: FolderDialogState) => {
    setFolderName(state.folder?.name ?? "");
    setFolderDialog(state);
  };

  const handleFolderSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!folderDialog || !folderName.trim() || folderSaving) return;
    setFolderSaving(true);
    try {
      if (folderDialog.mode === "create") {
        const folder = await createFolder(folderName);
        selectView("folder", folder.id);
      } else if (folderDialog.folder) {
        await renameFolder(folderDialog.folder.id, folderName);
      }
      setFolderDialog(null);
    } catch (error) {
      console.error("Unable to save folder", error);
      toast({
        title: "Folder not saved",
        description: "Folder names must be unique. Please choose another name or try again.",
        variant: "destructive",
      });
    } finally {
      setFolderSaving(false);
    }
  };

  const confirmFolderDelete = async () => {
    if (!folderToDelete) return;
    try {
      await deleteFolder(folderToDelete.id);
      if (folderId === folderToDelete.id) selectView("recent");
      setFolderToDelete(null);
      toast({ title: "Folder deleted", description: "Its notes are still available in General." });
    } catch (error) {
      console.error("Unable to delete folder", error);
      toast({
        title: "Folder not deleted",
        description: "Nothing was changed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmPermanentDelete = async () => {
    if (!noteToDelete) return;
    try {
      await deleteNotePermanently(noteToDelete.id);
      setNoteToDelete(null);
      toast({ title: "Note deleted permanently" });
    } catch (error) {
      console.error("Unable to permanently delete note", error);
      toast({
        title: "Note not deleted",
        description: "Nothing was removed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-[calc(100dvh-7.5rem)]">
      <div className="mb-5 flex flex-col gap-4 border-b-[1.5px] border-foreground pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="sp-label text-[9px] text-[#2997FF]">Personal workspace</p>
          <h1 className="sp-display mt-1 text-3xl leading-none sm:text-4xl">Notes</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Capture what matters, organize it, and find it when you need it.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => void handleCreateNote()}
          disabled={creating}
          className="h-11 shrink-0 rounded-none bg-[#2997FF] px-5 text-white hover:bg-[#0066CC]"
        >
          <Plus className="h-4 w-4" />
          {creating ? "Creating" : "New note"}
        </Button>
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-7">
        <aside className="min-w-0 border-b border-foreground/20 pb-5 lg:border-b-0 lg:border-r lg:pr-5">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <label htmlFor="note-search" className="sr-only">Search notes</label>
            <Input
              id="note-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search notes"
              className="h-11 rounded-none border-foreground/30 bg-card pl-9"
            />
          </div>

          <nav className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-1" aria-label="Note views">
            <NotesNavButton
              active={view === "recent"}
              icon={Clock3}
              label="Recent"
              count={activeCount}
              onClick={() => selectView("recent")}
            />
            <NotesNavButton
              active={view === "all"}
              icon={FileText}
              label="All notes"
              count={activeCount}
              onClick={() => selectView("all")}
            />
            <NotesNavButton
              active={view === "favorites"}
              icon={Star}
              label="Favorites"
              count={favoriteCount}
              onClick={() => selectView("favorites")}
            />
            <NotesNavButton
              active={view === "trash"}
              icon={Trash2}
              label="Trash"
              count={trashCount}
              onClick={() => selectView("trash")}
            />
          </nav>

          <div className="mt-5 border-t border-foreground/15 pt-4">
            <div className="mb-2 flex items-center justify-between gap-2 px-2">
              <p className="sp-label text-[8px] text-foreground/45">Folders</p>
              <button
                type="button"
                onClick={() => openFolderDialog({ mode: "create" })}
                aria-label="Create folder"
                className="flex h-8 w-8 items-center justify-center text-foreground/50 transition-colors hover:text-[#2997FF]"
              >
                <FolderPlus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1">
              <NotesNavButton
                active={view === "folder" && folderId === null}
                icon={Folder}
                label="General"
                count={notes.filter((note) => note.deleted_at === null && note.folder_id === null).length}
                onClick={() => selectView("folder", null)}
              />
              {folders.map((folder) => (
                <div key={folder.id} className="group flex items-center">
                  <NotesNavButton
                    active={view === "folder" && folderId === folder.id}
                    icon={Folder}
                    label={folder.name}
                    count={notes.filter((note) => note.deleted_at === null && note.folder_id === folder.id).length}
                    onClick={() => selectView("folder", folder.id)}
                    className="min-w-0 flex-1"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Folder options for ${folder.name}`}
                        className="flex h-9 w-8 shrink-0 items-center justify-center text-foreground/40 opacity-100 transition-colors hover:text-foreground lg:opacity-0 lg:group-hover:opacity-100 lg:focus:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-none">
                      <DropdownMenuItem onSelect={() => openFolderDialog({ mode: "rename", folder })}>
                        <Pencil className="mr-2 h-4 w-4" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setFolderToDelete(folder)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete folder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="min-w-0" aria-labelledby="notes-view-heading">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 id="notes-view-heading" className="sp-display text-xl">
                {viewLabel(view, activeFolder?.name)}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {visibleNotes.length} {visibleNotes.length === 1 ? "note" : "notes"}
                {query.trim() ? " found" : ""}
              </p>
            </div>
          </div>

          {isLoading ? (
            <NotesSkeleton />
          ) : isError ? (
            <div className="border-[1.5px] border-foreground bg-card p-8 text-center">
              <h3 className="sp-display text-lg">Notes could not load</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Your notes are still safe. Check your connection and try again.
              </p>
              <Button type="button" variant="outline" onClick={() => void refetch()} className="mt-5 rounded-none">
                Try again
              </Button>
            </div>
          ) : visibleNotes.length === 0 ? (
            <NotesEmptyState
              view={view}
              hasQuery={Boolean(query.trim())}
              onCreate={() => void handleCreateNote()}
            />
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,270px),1fr))] gap-3">
              {visibleNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  folders={folders}
                  onOpen={() => navigate(`/app/notes/${note.id}`)}
                  onFavorite={() => void handleFavorite(note)}
                  onTrash={() => void handleTrash(note)}
                  onRestore={() => void handleRestore(note)}
                  onDelete={() => setNoteToDelete(note)}
                  onMove={(nextFolderId) => void handleMove(note, nextFolderId)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <Dialog open={folderDialog !== null} onOpenChange={(open) => !open && setFolderDialog(null)}>
        <DialogContent className="rounded-none border-[1.5px] border-foreground sm:max-w-md">
          <form onSubmit={handleFolderSubmit}>
            <DialogHeader>
              <DialogTitle className="sp-display text-xl">
                {folderDialog?.mode === "rename" ? "Rename folder" : "Create folder"}
              </DialogTitle>
              <DialogDescription>
                Use folders to keep related notes together.
              </DialogDescription>
            </DialogHeader>
            <div className="py-5">
              <label htmlFor="folder-name" className="sp-label mb-2 block text-[9px]">Folder name</label>
              <Input
                id="folder-name"
                value={folderName}
                onChange={(event) => setFolderName(event.target.value)}
                maxLength={64}
                autoFocus
                className="rounded-none border-foreground/40"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFolderDialog(null)} className="rounded-none">
                Cancel
              </Button>
              <Button type="submit" disabled={!folderName.trim() || folderSaving} className="rounded-none">
                {folderSaving ? "Saving" : "Save folder"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={folderToDelete !== null} onOpenChange={(open) => !open && setFolderToDelete(null)}>
        <AlertDialogContent className="rounded-none border-[1.5px] border-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="sp-display">Delete this folder?</AlertDialogTitle>
            <AlertDialogDescription>
              The folder will be removed. Its notes will move to General and will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmFolderDelete()} className="rounded-none bg-destructive text-destructive-foreground">
              Delete folder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={noteToDelete !== null} onOpenChange={(open) => !open && setNoteToDelete(null)}>
        <AlertDialogContent className="rounded-none border-[1.5px] border-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="sp-display">Delete this note permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The note and everything written in it will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmPermanentDelete()} className="rounded-none bg-destructive text-destructive-foreground">
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface NotesNavButtonProps {
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  onClick: () => void;
  className?: string;
}

function NotesNavButton({ active, icon: Icon, label, count, onClick, className }: NotesNavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 min-w-0 items-center gap-2 px-2 text-left text-xs transition-colors",
        active ? "bg-foreground text-background" : "text-foreground/60 hover:bg-foreground/[0.05] hover:text-foreground",
        className,
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", active && "text-[#2997FF]")} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className={cn("text-[10px] tabular-nums", active ? "text-background/60" : "text-foreground/35")}>{count}</span>
    </button>
  );
}

interface NoteCardProps {
  note: Note;
  folders: NoteFolder[];
  onOpen: () => void;
  onFavorite: () => void;
  onTrash: () => void;
  onRestore: () => void;
  onDelete: () => void;
  onMove: (folderId: string | null) => void;
}

function NoteCard({ note, folders, onOpen, onFavorite, onTrash, onRestore, onDelete, onMove }: NoteCardProps) {
  const isDeleted = note.deleted_at !== null;
  const folder = folders.find((item) => item.id === note.folder_id);

  return (
    <article className="group flex min-h-[230px] flex-col border-[1.5px] border-foreground bg-card transition-transform duration-150 hover:-translate-y-0.5">
      <button type="button" onClick={onOpen} className="min-h-0 flex-1 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2997FF]">
        {folder ? (
          <span className="mb-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Folder className="h-3 w-3" /> {folder.name}
          </span>
        ) : null}
        <h3 className="line-clamp-2 text-base font-semibold leading-snug">{displayNoteTitle(note.title)}</h3>
        <p className="mt-3 line-clamp-5 text-sm leading-6 text-muted-foreground">{notePreview(note.body_text)}</p>
      </button>
      <footer className="flex h-12 shrink-0 items-center justify-between border-t border-foreground/15 px-3">
        <button
          type="button"
          onClick={onFavorite}
          disabled={isDeleted}
          aria-label={note.is_favorite ? "Remove from favorites" : "Add to favorites"}
          className="flex h-9 w-9 items-center justify-center text-foreground/45 transition-colors hover:text-[#2997FF] disabled:opacity-30"
        >
          <Star className={cn("h-4 w-4", note.is_favorite && "fill-[#2997FF] text-[#2997FF]")} />
        </button>
        <div className="flex min-w-0 items-center gap-1">
          <span className="truncate text-[10px] text-muted-foreground">
            {formatDistanceToNowStrict(new Date(note.updated_at), { addSuffix: true })}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" aria-label={`Options for ${displayNoteTitle(note.title)}`} className="flex h-9 w-9 items-center justify-center text-foreground/45 transition-colors hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-none">
              {isDeleted ? (
                <>
                  <DropdownMenuItem onSelect={onRestore}>
                    <ArchiveRestore className="mr-2 h-4 w-4" /> Restore
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={onDelete} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete permanently
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onSelect={onOpen}>
                    <Pencil className="mr-2 h-4 w-4" /> Open note
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={onFavorite}>
                    <Star className="mr-2 h-4 w-4" /> {note.is_favorite ? "Remove favorite" : "Add favorite"}
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Folder className="mr-2 h-4 w-4" /> Move to folder
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="rounded-none">
                      <DropdownMenuItem disabled={note.folder_id === null} onSelect={() => onMove(null)}>General</DropdownMenuItem>
                      {folders.map((item) => (
                        <DropdownMenuItem key={item.id} disabled={note.folder_id === item.id} onSelect={() => onMove(item.id)}>
                          {item.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={onTrash} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Move to Trash
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </footer>
    </article>
  );
}

function NotesEmptyState({ view, hasQuery, onCreate }: { view: NoteView; hasQuery: boolean; onCreate: () => void }) {
  const isTrash = view === "trash";
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center border-[1.5px] border-dashed border-foreground/35 bg-card/40 px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center border border-foreground/20 bg-background text-[#2997FF]">
        {hasQuery ? <Search className="h-7 w-7" /> : isTrash ? <Trash2 className="h-7 w-7" /> : <FilePlus2 className="h-7 w-7" />}
      </span>
      <h3 className="sp-display mt-5 text-xl">
        {hasQuery ? "No matching notes" : isTrash ? "Trash is empty" : "Start your first note"}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {hasQuery
          ? "Try a different word or choose another note view."
          : isTrash
            ? "Notes you move to Trash will stay here until you restore or permanently delete them."
            : "Capture an idea, meeting takeaway, prayer, plan, or anything you want to remember."}
      </p>
      {!hasQuery && !isTrash ? (
        <Button type="button" onClick={onCreate} className="mt-5 rounded-none bg-[#2997FF] text-white hover:bg-[#0066CC]">
          <Plus className="h-4 w-4" /> New note
        </Button>
      ) : null}
    </div>
  );
}

function NotesSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,270px),1fr))] gap-3" aria-label="Loading notes">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="min-h-[230px] animate-pulse border-[1.5px] border-foreground/20 bg-card p-5">
          <div className="h-4 w-2/3 bg-foreground/10" />
          <div className="mt-6 h-3 w-full bg-foreground/10" />
          <div className="mt-3 h-3 w-5/6 bg-foreground/10" />
          <div className="mt-3 h-3 w-1/2 bg-foreground/10" />
        </div>
      ))}
    </div>
  );
}
