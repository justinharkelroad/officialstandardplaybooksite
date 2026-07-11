import { CheckCircle2, Flag, ShieldAlert, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { DailyFrameCard } from "@/app/lib/dailyFrame";

interface DailyFrameReportCardProps {
  card?: Partial<DailyFrameCard> | null;
}

function Field({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | null;
  icon: typeof Target;
}) {
  if (!value) return null;

  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-sm leading-relaxed text-foreground">{value}</p>
    </div>
  );
}

export function DailyFrameReportCard({ card }: DailyFrameReportCardProps) {
  if (!card) return null;

  return (
    <Card className="mb-6 border-border/10">
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Sparkles className="h-4 w-4 text-[#2997FF]" />
              Daily Frame Card
            </div>
            <h2 className="mt-1 text-xl font-semibold">Today has a frame.</h2>
          </div>
          {card.today_lane ? (
            <Badge variant="secondary" className="shrink-0">
              {card.today_lane}
            </Badge>
          ) : null}
        </div>

        <Field label="Gratitude Snapshot" value={card.gratitude_snapshot} icon={Sparkles} />
        <Field label="Today's Win" value={card.todays_win} icon={Target} />
        <Field label="Proof" value={card.proof} icon={CheckCircle2} />
        <Field label="Likely Obstacle" value={card.likely_obstacle} icon={ShieldAlert} />
        <Field label="If-Then Plan" value={card.if_then_plan} icon={Flag} />

        {card.declared_action ? (
          <div className="rounded-lg border border-[#2997FF]/25 bg-[#2997FF]/10 p-4">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#2997FF] dark:text-[#2997FF]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Declared Commitment
            </div>
            <p className="text-sm font-medium leading-relaxed text-foreground">
              {card.declared_action}
            </p>
          </div>
        ) : null}

        {card.coach_check_tomorrow ? (
          <p className="text-sm text-muted-foreground">{card.coach_check_tomorrow}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
