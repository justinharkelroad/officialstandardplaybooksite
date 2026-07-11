import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Circle, Clock3, Flag, History, Info, ShieldAlert, Target } from "lucide-react";
import type { ReactNode } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { DailyFrameCommitment, DailyFrameStatus } from "@/app/lib/dailyFrame";

type DailyFrameRow = DailyFrameCommitment & {
  effective_status?: DailyFrameStatus | "no_frame";
};

interface DailyFrameWidgetProps {
  showRecent?: boolean;
  variant?: "default" | "dashboard" | "personal-growth";
  className?: string;
}

const statusLabels: Record<string, string> = {
  open: "Open",
  completed: "Complete",
  overdue: "Overdue",
  missed: "Missed",
  no_frame: "No frame",
};

const domainLabels: Record<string, string> = {
  body: "Body",
  being: "Being",
  balance: "Balance",
  business: "Business",
};

function statusClass(status?: string) {
  if (status === "completed") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (status === "overdue" || status === "missed") return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
  return "bg-muted text-muted-foreground";
}

function DailyFrameProgressTrail({
  hasFrame,
  status,
}: {
  hasFrame: boolean;
  status?: string;
}) {
  const completed = status === "completed";
  const steps = [
    { key: "not_started", label: "Not Started", active: !hasFrame },
    { key: "framed", label: "Framed", active: hasFrame && !completed },
    { key: "completed", label: "Completed", active: completed },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {steps.map((step, index) => {
        const reached =
          (hasFrame && index <= 1) || completed || (step.key === "not_started" && !hasFrame);

        return (
          <div
            key={step.key}
            className={cn(
              "rounded-lg border px-2.5 py-2 text-center text-[11px] font-semibold uppercase tracking-wide",
              step.active && step.key === "completed"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : step.active
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                  : reached
                    ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-border/60 bg-muted/20 text-muted-foreground",
            )}
          >
            {step.label}
          </div>
        );
      })}
    </div>
  );
}

function DetailBlock({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children?: ReactNode;
}) {
  if (!children) return null;

  return (
    <div className="rounded-lg border border-border/60 bg-muted/25 p-3">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
        {children}
      </p>
    </div>
  );
}

function DailyFrameDetailsDialog({
  frame,
  status,
}: {
  frame: DailyFrameRow;
  status?: string;
}) {
  const gratitudeItems = [
    frame.gratitude_body && `Body: ${frame.gratitude_body}`,
    frame.gratitude_being && `Being: ${frame.gratitude_being}`,
    frame.gratitude_balance && `Balance: ${frame.gratitude_balance}`,
    frame.gratitude_business && `Business: ${frame.gratitude_business}`,
  ].filter(Boolean);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-8 px-2 text-xs">
          <Info className="mr-1.5 h-3.5 w-3.5" />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Daily Frame details</DialogTitle>
          <DialogDescription>
            {format(new Date(`${frame.frame_date}T00:00:00`), "MMM d")} · {domainLabels[frame.core4_domain] ?? frame.core4_domain} · {statusLabels[status ?? "open"] ?? status}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-lg border border-border/60 bg-background p-4">
            <p className="text-xs font-medium text-muted-foreground">Commitment</p>
            <p className="mt-2 whitespace-pre-wrap text-base font-semibold leading-7">
              {frame.declared_commitment}
            </p>
          </div>

          <DetailBlock icon={<Target className="h-3.5 w-3.5" />} label="Measurable proof">
            {frame.measurable_proof}
          </DetailBlock>
          <DetailBlock icon={<ShieldAlert className="h-3.5 w-3.5" />} label="Likely obstacle">
            {frame.likely_obstacle}
          </DetailBlock>
          <DetailBlock icon={<Clock3 className="h-3.5 w-3.5" />} label="If-then plan">
            {frame.if_then_plan}
          </DetailBlock>
          <DetailBlock icon={<Flag className="h-3.5 w-3.5" />} label="Target outcome">
            {frame.target_outcome}
          </DetailBlock>
          <DetailBlock icon={<History className="h-3.5 w-3.5" />} label="Current state">
            {frame.current_state}
          </DetailBlock>
          <DetailBlock icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Gratitude snapshot">
            {gratitudeItems.join("\n")}
          </DetailBlock>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DailyFrameWidget({
  showRecent = true,
  variant = "default",
  className,
}: DailyFrameWidgetProps) {
  const queryClient = useQueryClient();
  const isDashboard = variant === "dashboard";
  const isPersonalGrowth = variant === "personal-growth";
  const startPath = "/app/flows/start/daily-frame";

  const query = useQuery({
    queryKey: ["daily-frame"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("daily-frame-commitments", {
        body: { action: "get_my_frames", history_days: 7 },
      });

      if (error) throw error;
      return data as { today: DailyFrameRow | null; recent: DailyFrameRow[] };
    },
  });

  const markComplete = useMutation({
    mutationFn: async (commitmentId: string) => {
      const { data, error } = await supabase.functions.invoke("daily-frame-commitments", {
        body: { action: "mark_complete", commitment_id: commitmentId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-frame"] });
    },
    onError: () => {
      toast.error("Failed to mark the Daily Frame complete");
    },
  });

  const today = query.data?.today ?? null;
  const todayStatus = today?.effective_status ?? today?.status;
  const recent = (query.data?.recent ?? []).filter((row) => row.id !== today?.id);
  const viewPath = today?.flow_session_id
    ? `/app/flows/complete/${today.flow_session_id}`
    : null;
  const actionPath = viewPath ?? startPath;
  const actionLabel = today && viewPath ? "View" : today ? "Start New" : "Start";
  const personalGrowthActionLabel =
    today && viewPath
      ? "View Daily Frame"
      : today
        ? "Start New Daily Frame"
        : "Start Daily Frame";

  return (
    <Card
      className={cn(
        "border-border/60",
        isDashboard && "w-full",
        isPersonalGrowth &&
          "relative flex h-full flex-col overflow-hidden border-border border-l-4 border-l-[#64748b]/40 bg-card ring-1 ring-inset ring-white/[0.04]",
        className,
      )}
    >
      {isPersonalGrowth ? (
        <CardHeader
          className="gap-3 pb-4"
          style={{
            backgroundColor: "#64748b12",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Daily commitment
              </p>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    today
                      ? "bg-[#f59e0b] text-white shadow-md shadow-[#f59e0b]/30"
                      : "bg-[#f59e0b]/15 text-[#b45309] dark:text-[#fbbf24]",
                  )}
                >
                  <Flag className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <CardTitle className="text-lg font-semibold uppercase leading-tight tracking-[0.04em]">
                    Daily Frame
                  </CardTitle>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    One measurable commitment for today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      ) : (
        <CardHeader className={cn("space-y-2 pb-3", isDashboard && "pb-2")}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Flag className="h-4 w-4 text-amber-500" />
                Daily Frame
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                One measurable commitment for today.
              </p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link to={actionPath}>{actionLabel}</Link>
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent
        className={cn(
          "space-y-4",
          isDashboard && "pt-0",
          isPersonalGrowth && "flex flex-1 flex-col pt-0",
        )}
      >
        {isDashboard && !query.isLoading ? (
          <DailyFrameProgressTrail hasFrame={Boolean(today)} status={todayStatus} />
        ) : null}

        {query.isLoading ? (
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
            Loading today's frame...
          </div>
        ) : today ? (
          <div className={cn("rounded-lg border border-border/60 bg-muted/30 p-4", isDashboard && "p-3 md:p-4")}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{domainLabels[today.core4_domain] ?? today.core4_domain}</Badge>
                <Badge className={cn("border-0", statusClass(todayStatus))}>
                  {statusLabels[todayStatus ?? "open"] ?? todayStatus}
                </Badge>
              </div>
              <DailyFrameDetailsDialog frame={today} status={todayStatus} />
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id={`daily-frame-${today.id}`}
                className="mt-1"
                checked={today.status === "completed"}
                disabled={today.status === "completed" || markComplete.isPending}
                onCheckedChange={(checked) => {
                  if (checked) markComplete.mutate(today.id);
                }}
                aria-label="Mark Daily Frame commitment complete"
              />
              <label htmlFor={`daily-frame-${today.id}`} className="min-w-0 flex-1 cursor-pointer">
                <span className={cn(
                  "line-clamp-4 text-sm font-semibold leading-6",
                  today.status === "completed" && "text-muted-foreground line-through",
                )}>
                  {today.declared_commitment}
                </span>
              </label>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
            No Daily Frame yet today. Open the Flow when you are ready to set the day.
          </div>
        )}

        {showRecent && recent.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <History className="h-3.5 w-3.5" />
              Recent Frames
            </div>
            <div className="space-y-2">
              {recent.slice(0, 7).map((row) => {
                const status = row.effective_status ?? row.status;
                return (
                  <div key={row.id} className="flex items-center gap-3 rounded-md border border-border/50 px-3 py-2 text-sm">
                    {status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{row.declared_commitment}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(`${row.frame_date}T00:00:00`), "MMM d")} · {domainLabels[row.core4_domain] ?? row.core4_domain}
                      </p>
                    </div>
                    <Badge className={cn("border-0", statusClass(status))}>
                      {statusLabels[status] ?? status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {isPersonalGrowth ? (
          <div className="!mt-auto pt-4">
            <Button
              asChild
              variant="outline"
              className="w-full justify-between border-[#64748b]/40 bg-[#64748b]/15 text-[#475569] hover:bg-[#64748b]/25 dark:text-[#cbd5e1]"
            >
              <Link to={actionPath}>
                {personalGrowthActionLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
