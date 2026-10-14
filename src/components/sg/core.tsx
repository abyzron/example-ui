import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  History,
  Loader2,
  Moon,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-state";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { subjectColor, subjectText, type GateState, type Lecture, type Subject } from "@/lib/data";

export function Logo({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className="press flex items-center gap-2.5 rounded-lg">
      <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-foreground text-background shadow-soft">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M5 20V10a7 7 0 0 1 14 0v10" />
          <path d="M9.5 20v-7.5a2.5 2.5 0 0 1 5 0V20" className="text-primary" stroke="var(--primary)" />
        </svg>
      </span>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-tight">
          Study<span className="text-muted-foreground">Gate</span>
        </span>
      )}
    </Link>
  );
}

export function StudyModeToggle({ size = "md" }: { size?: "md" | "sm" }) {
  const { studyMode, setStudyMode } = useApp();
  return (
    <button
      role="switch"
      aria-checked={studyMode}
      onClick={() => setStudyMode(!studyMode)}
      className={cn(
        "press group flex items-center gap-2 rounded-full border pl-1 pr-3 font-medium",
        size === "md" ? "h-9 text-[13px]" : "h-8 text-xs",
        studyMode
          ? "border-primary/30 bg-primary-soft text-primary"
          : "border-border bg-secondary text-muted-foreground hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "relative h-6 w-10 rounded-full transition-colors duration-200",
          studyMode ? "bg-primary" : "bg-border-strong",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-surface shadow-soft transition-transform duration-200",
            studyMode && "translate-x-4",
          )}
        />
      </span>
      Study Mode <span className="tabular-nums">{studyMode ? "On" : "Off"}</span>
    </button>
  );
}

export function IconBtn({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label={label}
          onClick={onClick}
          className={cn(
            "press grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground",
            active && "bg-accent text-foreground",
          )}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function Header({ children }: { children?: React.ReactNode }) {
  const { dark, setDark, openDialog } = useApp();
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid h-14 max-w-[1400px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6">
        <Logo />
        <div className="min-w-0">{children}</div>
        <div className="flex items-center gap-1">
          <div className="hidden sm:block mr-1.5">
            <StudyModeToggle />
          </div>
          <IconBtn icon={dark ? Sun : Moon} label={dark ? "Light theme" : "Dark theme"} onClick={() => setDark(!dark)} />
          <IconBtn icon={History} label="Watch history" onClick={() => openDialog("history")} />
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/settings"
                aria-label="Settings"
                className="press grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <Settings2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex justify-center border-t border-border/60 py-2 sm:hidden">
        <StudyModeToggle size="sm" />
      </div>
    </header>
  );
}

export function SubjectDot({ subject, className }: { subject: Subject; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", subjectColor[subject])} />
      {subject}
    </span>
  );
}

export function Thumb({
  lecture,
  className,
  progress,
  showDuration = true,
}: {
  lecture: Lecture;
  className?: string;
  progress?: number;
  showDuration?: boolean;
}) {
  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-xl bg-player thumb-grid", className)}>
      <div className={cn("absolute -right-6 -bottom-8 h-28 w-28 rounded-full opacity-25 blur-2xl", subjectColor[lecture.subject])} />
      <span
        className={cn(
          "absolute inset-0 grid place-items-center font-display text-[min(2.4rem,9cqw)] italic opacity-90",
          subjectText[lecture.subject],
        )}
        style={{ containerType: "inline-size" }}
      >
        {lecture.glyph}
      </span>
      <span className="absolute top-2 left-2 rounded-md bg-player-foreground/10 px-1.5 py-0.5 text-[10px] font-medium text-player-foreground/80 backdrop-blur">
        {lecture.chapter}
      </span>
      {showDuration && (
        <span className="absolute right-2 bottom-2 rounded-md bg-player/80 px-1.5 py-0.5 font-mono text-[10.5px] text-player-foreground">
          {lecture.duration}
        </span>
      )}
      {progress !== undefined && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-player-foreground/15">
          <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

export const GATE: Record<
  GateState,
  { label: string; desc: string; icon: LucideIcon; tone: string; dot: string }
> = {
  approved: { label: "Approved", desc: "Matches your study profile. Playback allowed.", icon: ShieldCheck, tone: "text-success bg-success/10 border-success/25", dot: "bg-success" },
  evaluating: { label: "Evaluating", desc: "Checking this lecture against your curriculum…", icon: Loader2, tone: "text-info bg-info/10 border-info/25", dot: "bg-info" },
  config: { label: "Configuration required", desc: "Add an AI provider in Settings to enable verification.", icon: Wrench, tone: "text-warning bg-warning/10 border-warning/25", dot: "bg-warning" },
  blocked: { label: "Blocked", desc: "Doesn't appear to match your selected subjects.", icon: ShieldAlert, tone: "text-destructive bg-destructive/10 border-destructive/25", dot: "bg-destructive" },
  review: { label: "Needs review", desc: "Partially relevant. Confirm before watching.", icon: AlertTriangle, tone: "text-warning bg-warning/10 border-warning/25", dot: "bg-warning" },
};

export function GateBadge({ state }: { state: GateState }) {
  const g = GATE[state];
  return (
    <span className={cn("inline-flex h-6 items-center gap-1.5 rounded-full border px-2 text-[11.5px] font-medium", g.tone)}>
      <g.icon className={cn("h-3.5 w-3.5", state === "evaluating" && "animate-spin")} />
      {g.label}
    </span>
  );
}

export function PlainBadge({ icon: Icon = Clock, children }: { icon?: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-border bg-secondary px-2 text-[11.5px] font-medium text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

export function SampleTag({ children = "Sample data" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-border-strong px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground">
      <CheckCircle2 className="h-3 w-3" /> {children}
    </span>
  );
}
