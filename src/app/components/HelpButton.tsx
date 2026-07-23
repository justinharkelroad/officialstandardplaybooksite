import { CircleHelp, Compass, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { spScopeClass } from "@/app/lib/theme";
import { cn } from "@/lib/utils";

interface HelpButtonProps {
  videoKey: string;
  label?: string;
  size?: string;
  className?: string;
}

type HelpContent = {
  title: string;
  purpose: string;
  cadence: string;
  actions: Array<{ label: string; explanation: string }>;
  recordingTitle: string;
};

const DEFAULT_HELP: HelpContent = {
  title: "Using Standard Playbook",
  purpose: "Use this page to turn intention into one clear next move.",
  cadence: "Quarterly sets direction. This Month sets focus. Weekly schedules the work. Daily records the proof.",
  actions: [
    { label: "Primary action", explanation: "Moves you to the next useful step." },
    { label: "Edit controls", explanation: "Change only the item beside the control." },
    { label: "Saved status", explanation: "Confirms whether your latest change reached your account." },
  ],
  recordingTitle: "Standard Playbook orientation",
};

const HELP_CONTENT: Record<string, HelpContent> = {
  "standard-playbook-overview": {
    title: "How Standard Playbook Fits Together",
    purpose:
      "Use the Hub to see what matters now, then move between four operating speeds without losing the long view.",
    cadence:
      "Quarterly sets direction. This Month names the focus. Weekly schedules the work. Daily records the proof. Flows, Reflection, and Debrief help you adjust.",
    actions: [
      { label: "Setup guide", explanation: "Shows the next useful action and tracks first-run progress." },
      { label: "Cadence map", explanation: "Moves directly between Quarterly, This Month, Weekly, and Daily." },
      { label: "Hub sections", explanation: "Surface the work already defined elsewhere; the Hub does not create duplicate goals." },
      { label: "Page help", explanation: "The question-mark icon explains that page and its controls." },
    ],
    recordingTitle: "Your six-minute Standard Playbook orientation",
  },
  core4_page: {
    title: "Daily / Core Four",
    purpose:
      "Record whether you completed your committed action in Body, Being, Balance, and Business. Each completed domain adds one point.",
    cadence:
      "Daily is proof. Your selected quarterly daily action appears on the matching domain so you know what the checkmark represents.",
    actions: [
      { label: "Domain tile", explanation: "Mark that domain complete for the selected day." },
      { label: "Week arrows", explanation: "Review prior weeks. Future days cannot be completed." },
      { label: "56-point score", explanation: "Combines Core Four, Flow days, and Weekly Playbook execution." },
    ],
    recordingTitle: "How Daily and the 56-point score work",
  },
  weekly_playbook: {
    title: "Weekly Playbook",
    purpose:
      "Turn ideas and monthly priorities into scheduled execution: one One Big Thing and up to four Power Plays per day.",
    cadence:
      "Weekly is the manual bridge between your monthly focus and the work on your calendar.",
    actions: [
      { label: "The Bench", explanation: "Holds meaningful work before it is scheduled." },
      { label: "Schedule", explanation: "Moves a Bench item onto a specific day as a Power Play." },
      { label: "One Big Thing", explanation: "Names the single result that would make the week meaningful." },
      { label: "Drag handle", explanation: "Drag a Bench item to a day or into One Big Thing on desktop." },
    ],
    recordingTitle: "Planning your week with the Bench and Power Plays",
  },
  "tool-quarterly-targets": {
    title: "Quarterly Direction",
    purpose:
      "Build a 90-day plan across Body, Being, Balance, and Business, then turn it into monthly focus and optional daily actions.",
    cadence:
      "Quarterly suggestions can seed empty Current Month slots. You choose what moves into Weekly and what counts as Daily proof.",
    actions: [
      { label: "Brain Dump", explanation: "Capture possibilities without perfect wording." },
      { label: "Use These Targets", explanation: "Choose one or two targets per domain for review." },
      { label: "Plan the Next 3 Months", explanation: "Creates editable monthly suggestions from the approved targets." },
      { label: "Daily proof ideas", explanation: "Choose optional actions that can appear in Daily." },
    ],
    recordingTitle: "Building a quarter that reaches today",
  },
  "flows-overview": {
    title: "Flows",
    purpose:
      "Use a structured text or voice conversation to work through a moment and leave with an insight and a concrete action.",
    cadence:
      "Flows are available whenever life happens. Completed actions can move onto the Weekly Bench.",
    actions: [
      { label: "Flow info icon", explanation: "Explains when that specific Flow is useful." },
      { label: "Start", explanation: "Choose text or voice, then move through the guided questions." },
      { label: "Flow Profile", explanation: "Gives the coach private context so its questions fit you better." },
      { label: "Library", explanation: "Revisit completed sessions and their declared actions." },
    ],
    recordingTitle: "Choosing and completing your first Flow",
  },
  The_Debrief: {
    title: "Weekly Debrief",
    purpose:
      "Close the prior week honestly, identify patterns, and choose the One Big Thing for the week ahead.",
    cadence:
      "Debrief opens for a new entry on Sunday and Monday. Completed history remains available all week.",
    actions: [
      { label: "Continue", explanation: "Moves through one reflection section at a time." },
      { label: "Add to Bench", explanation: "Carries a course correction into Weekly Playbook." },
      { label: "Seal the week", explanation: "Finalizes the review and creates the historical report." },
    ],
    recordingTitle: "Closing the week with Debrief",
  },
  monthly_missions: {
    title: "This Month",
    purpose:
      "Give each Core Four domain one live mission for the current month, with weekly strikes that make progress visible.",
    cadence:
      "Quarterly can seed this page. Anything you edit here remains yours. Send a mission to the Weekly Bench when you are ready to schedule it.",
    actions: [
      { label: "Add Mission", explanation: "Creates one live mission in an empty domain." },
      { label: "Send to Weekly", explanation: "Adds the mission to the Weekly Bench without scheduling it yet." },
      { label: "Complete", explanation: "Closes the mission for this month." },
      { label: "Delete", explanation: "Archives the mission and opens the domain for a replacement." },
    ],
    recordingTitle: "Turning a quarterly plan into this month's focus",
  },
  weekly_reflection: {
    title: "Weekly Reflection",
    purpose:
      "See the themes, signals, and I AM statements emerging from the Flows you completed during the selected week.",
    cadence:
      "Reflection reads your completed Flows. It does not score the week or replace Debrief; it helps you notice what your own words are revealing.",
    actions: [
      { label: "Week selector", explanation: "Moves through generated reflections one week at a time." },
      { label: "Refresh", explanation: "Rebuilds the reflection when newer completed Flows are available." },
      { label: "Source Flow", explanation: "Opens the completed conversation that supports a surfaced insight." },
    ],
    recordingTitle: "Reading your Weekly Reflection",
  },
  theta_audio: {
    title: "90 Day Audio",
    purpose:
      "Turn your primary quarterly direction into editable affirmations, choose a voice, and mix a personal 21-minute audio track.",
    cadence:
      "90 Day Audio reinforces the quarter. It pulls saved main-focus targets automatically, but you review every statement before generating audio.",
    actions: [
      { label: "Pull targets", explanation: "Loads the saved main focus from each quarterly domain." },
      { label: "Approve affirmations", explanation: "Edit or regenerate the statements before audio is created." },
      { label: "Download or share", explanation: "Saves the finished mix from the device you are using." },
    ],
    recordingTitle: "Creating your first 90 Day Audio track",
  },
};

export function HelpButton({
  videoKey,
  label,
  size = "sm",
  className,
}: HelpButtonProps) {
  const content = HELP_CONTENT[videoKey] ?? DEFAULT_HELP;
  const showLabel = Boolean(label);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={showLabel ? "sm" : "icon"}
          aria-label={`Help: ${content.title}`}
          className={cn(
            showLabel ? "h-9 gap-2" : size === "md" ? "h-9 w-9" : "h-7 w-7",
            "shrink-0 text-muted-foreground hover:text-[#2997FF]",
            className,
          )}
        >
          <CircleHelp className="h-4 w-4" />
          {showLabel ? label : null}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          spScopeClass(),
          "member-app !w-[calc(100%-2rem)] !max-w-2xl max-h-[min(760px,90vh)] overflow-y-auto border-[1.5px] border-foreground bg-background p-0 [&>button]:text-background [&>button]:opacity-100",
        )}
      >
        <DialogHeader className="border-b-[1.5px] border-foreground bg-foreground p-6 pr-12 text-background">
          <p className="sp-label text-[9px] text-[#2997FF]">Page guide</p>
          <DialogTitle className="mt-2 text-3xl text-background">{content.title}</DialogTitle>
          <DialogDescription className="mt-2 max-w-xl text-background/70">
            {content.purpose}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-6">
          <section>
            <p className="sp-label text-[9px] text-muted-foreground">Where this fits</p>
            <p className="mt-2 border-l-2 border-[#2997FF] pl-4 text-sm leading-relaxed">
              {content.cadence}
            </p>
          </section>

          <section>
            <p className="sp-label text-[9px] text-muted-foreground">What the controls do</p>
            <div className="mt-3 divide-y divide-foreground/15 border-y border-foreground/15">
              {content.actions.map((action) => (
                <div key={action.label} className="grid gap-1 py-3 sm:grid-cols-[150px_1fr] sm:gap-4">
                  <p className="text-sm font-semibold">{action.label}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {action.explanation}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-foreground/20 bg-muted/40 p-4">
            <div className="flex items-start gap-3">
              <PlayCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#2997FF]" />
              <div>
                <p className="font-semibold">Recording chapter</p>
                <p className="mt-1 text-sm text-muted-foreground">{content.recordingTitle}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  This guide is the in-app script for the short walkthrough video. The control stays useful
                  now and can host the finished recording without changing the page.
                </p>
              </div>
            </div>
          </section>

          <Button asChild variant="outline" className="w-full justify-between">
            <Link to="/app?setup=1">
              Open the full setup guide
              <Compass className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
