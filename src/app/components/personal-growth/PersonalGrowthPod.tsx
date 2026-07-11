import { forwardRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LatinCross } from "@/app/components/icons/LatinCross";
import {
  getAccentToken,
  type CadenceKey,
  type PersonalGrowthDomain,
} from "./domainTokens";

type IconLike = LucideIcon | typeof LatinCross;

type CtaConfig = {
  to: string;
  label: string;
  variant?: "default" | "outline" | "ghost";
};

type PersonalGrowthPodProps = {
  title: string;
  tagline?: string;
  eyebrow?: string;
  icon?: IconLike;
  accent?: PersonalGrowthDomain | CadenceKey;
  iconAccent?: PersonalGrowthDomain | CadenceKey;
  active?: boolean;
  badge?: ReactNode;
  cta?: CtaConfig;
  locked?: boolean;
  lockMessage?: string;
  lockCta?: CtaConfig;
  children?: ReactNode;
  className?: string;
};

export const PersonalGrowthPod = forwardRef<
  HTMLDivElement,
  PersonalGrowthPodProps
>(function PersonalGrowthPod(
  {
    title,
    tagline,
    eyebrow,
    icon: Icon,
    accent,
    iconAccent,
    active = false,
    badge,
    cta,
    locked = false,
    lockMessage,
    lockCta,
    children,
    className,
  },
  ref,
) {
  const accentToken = accent ? getAccentToken(accent) : null;
  const iconToken = iconAccent ? getAccentToken(iconAccent) : accentToken;
  const headerAccentStyle = accentToken
    ? {
        backgroundColor: `${accentToken.hex}12`,
      }
    : undefined;

  return (
    <Card
      ref={ref}
      spotlight
      className={cn(
        "relative flex h-full flex-col overflow-hidden border-border bg-card",
        "ring-1 ring-inset ring-white/[0.04]",
        accentToken && "border-l-4",
        accentToken?.borderClass,
        className,
      )}
    >
      <CardHeader className="gap-3 pb-4" style={headerAccentStyle}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-1.5">
            {eyebrow ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {eyebrow}
              </p>
            ) : null}
            <div className="flex items-center gap-3">
              {Icon ? (
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    iconToken
                      ? active
                        ? iconToken.solidClass
                        : iconToken.softClass
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
              ) : null}
              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold uppercase leading-tight tracking-[0.04em]">
                  {title}
                </h3>
                {tagline ? (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {tagline}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
          {badge ? <div className="shrink-0">{badge}</div> : null}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pt-0">
        {locked ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Lock className="h-4 w-4" />
              </span>
              <div className="space-y-2">
                <p className="font-medium text-foreground">
                  {lockMessage ?? "Available on 1:1 Coaching"}
                </p>
                {lockCta ? (
                  <Button
                    asChild
                    size="sm"
                    variant={lockCta.variant ?? "outline"}
                  >
                    <Link to={lockCta.to}>{lockCta.label}</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          children
        )}

        {cta && !locked ? (
          <Button
            asChild
            variant={cta.variant ?? "outline"}
            className={cn(
              "mt-auto w-full justify-between",
              // Default (no explicit cta.variant): editorial outline row —
              // 1.5px ink border, ink fill on hover, matching the landing's
              // "Learn More" CTA language.
              !cta.variant &&
                "border-[1.5px] border-[#0A0A0B] bg-transparent text-[#0A0A0B] hover:bg-[#0A0A0B] hover:text-[#F4F2EE]",
            )}
          >
            <Link to={cta.to}>
              {cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
});

PersonalGrowthPod.displayName = "PersonalGrowthPod";
