-- Member Notes: private, member-scoped folders and rich-text notes.
-- Notes use a soft-delete timestamp so the app can provide a recoverable Trash.

create table public.note_folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 64),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index note_folders_user_name_unique
  on public.note_folders (user_id, lower(trim(name)));

create index note_folders_user_sort_idx
  on public.note_folders (user_id, sort_order, created_at);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  folder_id uuid references public.note_folders(id) on delete set null,
  title text not null default 'Untitled note' check (char_length(title) <= 200),
  body jsonb not null default '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
  body_text text not null default '',
  is_favorite boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notes_user_updated_idx
  on public.notes (user_id, updated_at desc);

create index notes_user_folder_updated_idx
  on public.notes (user_id, folder_id, updated_at desc)
  where deleted_at is null;

create index notes_user_favorites_updated_idx
  on public.notes (user_id, updated_at desc)
  where is_favorite = true and deleted_at is null;

create index notes_user_trash_idx
  on public.notes (user_id, deleted_at desc)
  where deleted_at is not null;

alter table public.note_folders enable row level security;
alter table public.notes enable row level security;

revoke all on public.note_folders from anon, authenticated, service_role;
revoke all on public.notes from anon, authenticated, service_role;
grant select, insert, update, delete on public.note_folders to authenticated;
grant select, insert, update, delete on public.notes to authenticated;
grant all on public.note_folders to service_role;
grant all on public.notes to service_role;

create policy "note_folders_select_own"
  on public.note_folders for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    and public.is_active_member((select auth.uid()))
  );

create policy "note_folders_insert_own"
  on public.note_folders for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and public.is_active_member((select auth.uid()))
  );

create policy "note_folders_update_own"
  on public.note_folders for update
  to authenticated
  using (
    (select auth.uid()) = user_id
    and public.is_active_member((select auth.uid()))
  )
  with check (
    (select auth.uid()) = user_id
    and public.is_active_member((select auth.uid()))
  );

create policy "note_folders_delete_own"
  on public.note_folders for delete
  to authenticated
  using (
    (select auth.uid()) = user_id
    and public.is_active_member((select auth.uid()))
  );

create policy "notes_select_own"
  on public.notes for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    and public.is_active_member((select auth.uid()))
  );

create policy "notes_insert_own"
  on public.notes for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and public.is_active_member((select auth.uid()))
    and (
      folder_id is null
      or exists (
        select 1
        from public.note_folders folder
        where folder.id = folder_id
          and folder.user_id = (select auth.uid())
      )
    )
  );

create policy "notes_update_own"
  on public.notes for update
  to authenticated
  using (
    (select auth.uid()) = user_id
    and public.is_active_member((select auth.uid()))
  )
  with check (
    (select auth.uid()) = user_id
    and public.is_active_member((select auth.uid()))
    and (
      folder_id is null
      or exists (
        select 1
        from public.note_folders folder
        where folder.id = folder_id
          and folder.user_id = (select auth.uid())
      )
    )
  );

create policy "notes_delete_own"
  on public.notes for delete
  to authenticated
  using (
    (select auth.uid()) = user_id
    and public.is_active_member((select auth.uid()))
  );

create trigger update_note_folders_updated_at
  before update on public.note_folders
  for each row execute function public.member_app_set_updated_at();

create trigger update_notes_updated_at
  before update on public.notes
  for each row execute function public.member_app_set_updated_at();
