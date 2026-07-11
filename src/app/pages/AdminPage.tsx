import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/app/lib/auth";
import type { MemberRow } from "@/app/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

async function invokeAdminManageMember(payload: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("admin-manage-member", {
    body: payload,
  });
  if (error) {
    // supabase-js wraps non-2xx into FunctionsHttpError; surface the body message.
    let message = error.message;
    const anyError = error as { context?: Response };
    if (anyError.context) {
      try {
        const body = await anyError.context.json();
        if (body?.error) message = body.error;
      } catch {
        /* keep default message */
      }
    }
    throw new Error(message);
  }
  if (data?.error) throw new Error(String(data.error));
  return data;
}

export default function AdminPage() {
  const queryClient = useQueryClient();
  const { member: self } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<MemberRow | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const busyRef = useRef(false);

  const { data: members, isLoading } = useQuery({
    queryKey: ["admin-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("id, full_name, email, is_active, is_admin")
        .order("full_name");
      if (error) throw error;
      return data as MemberRow[];
    },
  });

  const createMutation = useMutation({
    mutationFn: () =>
      invokeAdminManageMember({
        action: "create",
        full_name: fullName,
        email,
        password,
      }),
    onSuccess: () => {
      toast.success("Client created");
      setCreateOpen(false);
      setFullName("");
      setEmail("");
      setPassword("");
      queryClient.invalidateQueries({ queryKey: ["admin-members"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Optimistic-toggle rule: the target value travels through mutation
  // variables — never re-derived from cache inside mutationFn.
  const toggleMutation = useMutation({
    mutationFn: ({ memberId, isActive }: { memberId: string; isActive: boolean }) =>
      invokeAdminManageMember({ action: "set_active", member_id: memberId, is_active: isActive }),
    onMutate: async ({ memberId, isActive }) => {
      await queryClient.cancelQueries({ queryKey: ["admin-members"] });
      const previous = queryClient.getQueryData<MemberRow[]>(["admin-members"]);
      queryClient.setQueryData<MemberRow[]>(["admin-members"], (old) =>
        (old ?? []).map((m) => (m.id === memberId ? { ...m, is_active: isActive } : m)),
      );
      return { previous };
    },
    onError: (err: Error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["admin-members"], ctx.previous);
      toast.error(err.message);
    },
    onSuccess: (_data, vars) => {
      toast.success(vars.isActive ? "Member reactivated" : "Member deactivated — sessions revoked");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["admin-members"] }),
  });

  const resetMutation = useMutation({
    mutationFn: ({ memberId }: { memberId: string }) =>
      invokeAdminManageMember({
        action: "reset_password",
        member_id: memberId,
        new_password: newPassword,
      }),
    onSuccess: () => {
      toast.success("Password reset");
      setResetTarget(null);
      setNewPassword("");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    createMutation.mutate(undefined, { onSettled: () => (busyRef.current = false) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-sm text-muted-foreground">
            Create logins, reset passwords, and flip access on or off.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> New client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Members</CardTitle>
          <CardDescription>
            Deactivating a client blocks login, revokes live sessions, and hides all their data
            until reactivated. Data is retained.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="divide-y divide-border">
              {(members ?? []).map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {m.full_name}
                      {m.is_admin && (
                        <span className="ml-2 rounded bg-[#2997FF]/15 px-1.5 py-0.5 text-xs text-[#2997FF]">
                          admin
                        </span>
                      )}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">{m.email}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setResetTarget(m)}
                      aria-label={`Reset password for ${m.full_name}`}
                    >
                      <KeyRound className="mr-1 h-3.5 w-3.5" /> Reset
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {m.is_active ? "Active" : "Inactive"}
                      </span>
                      <Switch
                        checked={m.is_active}
                        disabled={m.id === self?.id || toggleMutation.isPending}
                        onCheckedChange={(checked) =>
                          toggleMutation.mutate({ memberId: m.id, isActive: checked })
                        }
                        aria-label={`Toggle access for ${m.full_name}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(members ?? []).length === 0 && (
                <p className="py-3 text-sm text-muted-foreground">No members yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New client</DialogTitle>
            <DialogDescription>
              Creates the login immediately — no confirmation email is sent.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Full name</Label>
              <Input id="new-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Email</Label>
              <Input id="new-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Password</Label>
              <Input
                id="new-password"
                type="text"
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Minimum 8 characters. Share it with the client directly.</p>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating…" : "Create client"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!resetTarget} onOpenChange={(open) => !open && setResetTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>{resetTarget?.email}</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (resetTarget) resetMutation.mutate({ memberId: resetTarget.id });
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="reset-password">New password</Label>
              <Input
                id="reset-password"
                type="text"
                autoComplete="new-password"
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={resetMutation.isPending}>
                {resetMutation.isPending ? "Resetting…" : "Reset password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
