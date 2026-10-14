import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { SUBJECTS, subjectColor, type Subject } from "@/lib/data";

export function SubjectFilters({
  value,
  onChange,
}: {
  value: Subject | undefined;
  onChange: (s: Subject | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Chip active={!value} onClick={() => onChange(undefined)}>All subjects</Chip>
      {SUBJECTS.map((s) => (
        <Chip key={s} active={value === s} onClick={() => onChange(value === s ? undefined : s)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", subjectColor[s])} />
          {s}
        </Chip>
      ))}
    </div>
  );
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "press inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium",
        active
          ? "border-foreground/80 bg-foreground text-background"
          : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function SearchBox({
  initial = "",
  subject,
  size = "lg",
}: {
  initial?: string;
  subject?: Subject;
  size?: "lg" | "md";
}) {
  const [q, setQ] = useState(initial);
  const nav = useNavigate();
  const go = () => nav({ to: "/search", search: { q: q.trim(), subject } });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      className={cn(
        "group flex items-center gap-2 rounded-2xl border border-border bg-surface shadow-lift transition-shadow focus-within:border-primary/50 focus-within:shadow-focus",
        size === "lg" ? "h-16 pr-2 pl-5" : "h-11 rounded-xl pr-1.5 pl-3.5 shadow-soft",
      )}
    >
      <Search className={cn("shrink-0 text-muted-foreground", size === "lg" ? "h-5 w-5" : "h-4 w-4")} strokeWidth={2} />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={size === "lg" ? "Search a topic, or paste a YouTube video or playlist URL" : "Search lectures…"}
        className={cn(
          "min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground/70",
          size === "lg" ? "text-[16px]" : "text-sm",
        )}
      />
      {size === "lg" && (
        <kbd className="hidden rounded-md border border-border bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground md:inline">
          ↵
        </kbd>
      )}
      <button
        type="submit"
        className={cn(
          "press inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary font-medium text-primary-foreground shadow-soft hover:brightness-105",
          size === "lg" ? "h-12 px-4 text-sm" : "h-8 rounded-lg px-2.5 text-[13px]",
        )}
      >
        <span className={size === "lg" ? "hidden sm:inline" : "sr-only"}>Search</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
