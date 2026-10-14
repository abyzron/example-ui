import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Bookmark,
  BookmarkPlus,
  Captions,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Maximize2,
  NotebookPen,
  Pause,
  Play,
  SendHorizontal,
  Sparkles,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { GATE, GateBadge, Header, PlainBadge, SampleTag, SubjectDot, Thumb } from "@/components/sg/core";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";
import { BOOKMARKS, CHAPTERS, getLecture, INITIAL_PLAYLISTS, NOTES, type GateState } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/watch/$id")({
  loader: ({ params }) => {
    const lecture = getLecture(params.id);
    if (!lecture) throw notFound();
    return { lecture };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.lecture.title ?? "Lecture"} — StudyGate` },
      { name: "description", content: "Focused lecture workspace with notes, bookmarks and a study assistant." },
      { property: "og:title", content: `${loaderData?.lecture.title ?? "Lecture"} — StudyGate` },
      { property: "og:description", content: "Focused lecture workspace with notes, bookmarks and a study assistant." },
    ],
  }),
  component: Watch,
});

const GATES: GateState[] = ["approved", "evaluating", "config", "review", "blocked"];

function Watch() {
  const { lecture } = Route.useLoaderData();
  const { studyMode, playlists } = useApp();
  const [gate, setGate] = useState<GateState>("approved");
  const [playing, setPlaying] = useState(false);
  const pl = playlists.find((p) => p.lectureIds.includes(lecture.id)) ?? { ...INITIAL_PLAYLISTS[0], lectureIds: [lecture.id, ...INITIAL_PLAYLISTS[0].lectureIds.filter((x) => x !== lecture.id)] };
  const idx = pl.lectureIds.indexOf(lecture.id);
  const prev = pl.lectureIds[idx - 1];
  const next = pl.lectureIds[idx + 1];
  const locked = studyMode && gate !== "approved";
  const g = GATE[gate];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto grid max-w-[1400px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_372px]">
        <div className="min-w-0">
          {/* Player */}
          <div className="overflow-hidden rounded-2xl bg-player shadow-lift ring-1 ring-border/60">
            <div className="relative aspect-video">
              <Thumb lecture={lecture} showDuration={false} className="absolute inset-0 h-full rounded-none" />
              {locked ? (
                <div className="absolute inset-0 grid place-items-center bg-player/85 p-6 backdrop-blur-sm">
                  <div className="max-w-sm animate-rise text-center text-player-foreground">
                    <div className={cn("mx-auto grid h-12 w-12 place-items-center rounded-2xl border", g.tone)}>
                      <g.icon className={cn("h-5 w-5", gate === "evaluating" && "animate-spin")} />
                    </div>
                    <p className="mt-4 text-[15px] font-semibold">{g.label}</p>
                    <p className="mt-1 text-[13px] text-player-foreground/70">{g.desc}</p>
                    <div className="mt-4 flex justify-center gap-2">
                      {gate === "config" && <Button asChild size="sm"><Link to="/settings">Open Settings</Link></Button>}
                      {gate === "review" && <Button size="sm" onClick={() => setGate("approved")}>Watch anyway</Button>}
                      {gate === "blocked" && <Button size="sm" variant="secondary" asChild><Link to="/search" search={{ subject: lecture.subject }}>Find related lectures</Link></Button>}
                    </div>
                  </div>
                </div>
              ) : (
                <button onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause" : "Play"} className="group absolute inset-0 grid place-items-center">
                  <span className="press grid h-16 w-16 place-items-center rounded-full bg-player-foreground/90 text-player shadow-lift transition-transform group-hover:scale-105">
                    {playing ? <Pause className="h-6 w-6" fill="currentColor" /> : <Play className="ml-1 h-6 w-6" fill="currentColor" />}
                  </span>
                </button>
              )}
              <span className="absolute top-3 right-3 rounded-md bg-player/70 px-2 py-1 text-[10.5px] font-medium text-player-foreground/70">Embedded player placeholder</span>
            </div>
            {/* Toolbar */}
            <div className={cn("px-3 pt-2 pb-2.5 text-player-foreground", locked && "pointer-events-none opacity-40")}>
              <div className="group relative h-1 cursor-pointer rounded-full bg-player-foreground/15">
                <div className="h-full w-[38%] rounded-full bg-primary" />
                {CHAPTERS.slice(1).map((c, i) => (
                  <span key={c.t} className="absolute top-0 h-full w-0.5 bg-player" style={{ left: `${[13, 25, 43, 66][i]}%` }} />
                ))}
                <span className="absolute top-1/2 left-[38%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-soft" />
              </div>
              <div className="mt-2 flex items-center gap-0.5">
                <PBtn label={playing ? "Pause" : "Play"} onClick={() => setPlaying(!playing)}>{playing ? <Pause /> : <Play />}</PBtn>
                <PBtn label="Volume"><Volume2 /></PBtn>
                <span className="ml-1.5 font-mono text-[11.5px] text-player-foreground/70">27:34 / {lecture.duration}</span>
                <span className="mx-2 hidden truncate text-[12px] text-player-foreground/60 sm:inline">· Capacitors & dielectrics</span>
                <div className="ml-auto flex items-center gap-0.5">
                  <PBtn label="Add bookmark" onClick={() => toast("Bookmark added at 27:34", { description: "Simulated" })}><BookmarkPlus /></PBtn>
                  <PBtn label="Captions"><Captions /></PBtn>
                  <button className="press h-8 rounded-md px-2 font-mono text-[11.5px] text-player-foreground/80 hover:bg-player-foreground/10"><Gauge className="mr-1 inline h-3.5 w-3.5" />1.25×</button>
                  <PBtn label="Fullscreen"><Maximize2 /></PBtn>
                </div>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <SubjectDot subject={lecture.subject} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">· {lecture.chapter}</span>
              </div>
              <h1 className="mt-1.5 text-xl leading-snug font-semibold tracking-tight sm:text-[22px]">{lecture.title}</h1>
              <p className="mt-1 text-[13px] text-muted-foreground">{lecture.channel} · {lecture.views} views · {lecture.duration}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <Button variant="outline" size="sm" disabled={!prev} asChild={!!prev}>
                {prev ? <Link to="/watch/$id" params={{ id: prev }}><ChevronLeft /> Prev</Link> : <span><ChevronLeft /> Prev</span>}
              </Button>
              <Button size="sm" disabled={!next} asChild={!!next}>
                {next ? <Link to="/watch/$id" params={{ id: next }}>Next <ChevronRight /></Link> : <span>Next <ChevronRight /></span>}
              </Button>
            </div>
          </div>

          {/* Gate status */}
          <div className="panel mt-4 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                {studyMode ? <GateBadge state={gate} /> : <PlainBadge>Study Mode off · standard playback</PlainBadge>}
                <span className="hidden truncate text-[13px] text-muted-foreground md:inline">{studyMode ? g.desc : "Curriculum verification is skipped."}</span>
              </div>
              <SampleTag>Illustrative state</SampleTag>
            </div>
            <div className="mt-3 flex flex-wrap gap-1 border-t border-border pt-3">
              {GATES.map((s) => (
                <button key={s} onClick={() => setGate(s)}
                  className={cn("press inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12px] font-medium",
                    gate === s ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent hover:text-foreground")}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", GATE[s].dot)} /> {GATE[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Chapters */}
          <div className="mt-5">
            <p className="eyebrow mb-2 px-1">Chapters</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CHAPTERS.map((c, i) => (
                <button key={c.t} className={cn("press min-w-40 shrink-0 rounded-xl border p-2.5 text-left",
                  i === 3 ? "border-primary/40 bg-primary-soft" : "border-border bg-surface hover:border-border-strong")}>
                  <span className={cn("font-mono text-[11px]", i === 3 ? "text-primary" : "text-muted-foreground")}>{c.t}</span>
                  <p className="mt-0.5 text-[13px] font-medium">{c.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Side */}
        <aside className="flex min-w-0 flex-col gap-4">
          <section className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="min-w-0">
                <p className="eyebrow">Up next · {idx + 1}/{pl.lectureIds.length}</p>
                <Link to="/playlists/$id" params={{ id: pl.id }} className="block truncate text-[13.5px] font-semibold hover:text-primary">{pl.name}</Link>
              </div>
            </div>
            <ol className="max-h-72 overflow-y-auto p-1.5">
              {pl.lectureIds.map((id, i) => {
                const l = getLecture(id)!;
                const active = id === lecture.id;
                return (
                  <li key={id}>
                    <Link to="/watch/$id" params={{ id }}
                      className={cn("flex items-center gap-2.5 rounded-lg p-1.5 transition-colors",
                        active ? "bg-primary-soft" : "hover:bg-accent/60")}>
                      <span className={cn("w-4 shrink-0 text-center font-mono text-[11px]", active ? "text-primary" : "text-muted-foreground")}>
                        {active ? "▶" : i + 1}
                      </span>
                      <Thumb lecture={l} showDuration={false} className="w-20 shrink-0 rounded-md" />
                      <div className="min-w-0">
                        <p className={cn("line-clamp-2 text-[12.5px] leading-snug font-medium", active && "text-primary")}>{l.title}</p>
                        <p className="mt-0.5 font-mono text-[10.5px] text-muted-foreground">{l.duration}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
          <StudyPanel />
        </aside>
      </main>
    </div>
  );
}

function PBtn({ children, label, onClick }: { children: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button aria-label={label} title={label} onClick={onClick} className="press grid h-8 w-8 place-items-center rounded-md text-player-foreground/85 hover:bg-player-foreground/10 hover:text-player-foreground [&_svg]:h-4 [&_svg]:w-4">
      {children}
    </button>
  );
}

type Tab = "assistant" | "notes" | "bookmarks";

function StudyPanel() {
  const [tab, setTab] = useState<Tab>("assistant");
  const [notes, setNotes] = useState(NOTES);
  const [draft, setDraft] = useState("");
  const tabs: { k: Tab; label: string; icon: typeof Sparkles }[] = [
    { k: "assistant", label: "Assistant", icon: Sparkles },
    { k: "notes", label: "Notes", icon: NotebookPen },
    { k: "bookmarks", label: "Bookmarks", icon: Bookmark },
  ];
  return (
    <section className="panel flex min-h-[420px] flex-col overflow-hidden">
      <div className="flex gap-0.5 border-b border-border p-1.5">
        {tabs.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={cn("press flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md text-[12.5px] font-medium",
              tab === t.k ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}>
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "assistant" && (
        <div className="flex flex-1 flex-col">
          <div className="flex-1 space-y-3 p-4 text-[13px] leading-relaxed">
            <div className="ml-8 rounded-xl rounded-tr-sm bg-secondary px-3 py-2">Why does a dielectric increase capacitance?</div>
            <div className="flex gap-2.5">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary-soft text-primary"><Sparkles className="h-3.5 w-3.5" /></span>
              <div className="space-y-2">
                <p>The dielectric's molecules polarise and create an internal field opposing the applied one. The net field drops, so for the same charge the potential difference falls — and since <span className="font-mono text-[12px]">C = Q/V</span>, capacitance rises by a factor <em>K</em>.</p>
                <button className="press rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground hover:text-foreground">↳ 31:05 in lecture</button>
              </div>
            </div>
            <SampleTag>Sample response — not AI-generated</SampleTag>
          </div>
          <div className="border-t border-border p-3">
            <div className="flex flex-wrap gap-1.5 pb-2">
              {["Summarise this chapter", "Quiz me", "Explain 27:34"].map((s) => (
                <button key={s} className="press rounded-full border border-border px-2.5 py-1 text-[11.5px] text-muted-foreground hover:border-border-strong hover:text-foreground">{s}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); toast("Assistant is simulated in this prototype"); }}
              className="flex items-center gap-2 rounded-xl border border-input bg-surface px-3 focus-within:border-primary/50 focus-within:shadow-focus">
              <input placeholder="Ask about this lecture…" className="h-10 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground/70" />
              <button className="press grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground"><SendHorizontal className="h-3.5 w-3.5" /></button>
            </form>
          </div>
        </div>
      )}

      {tab === "notes" && (
        <div className="flex flex-1 flex-col">
          <ul className="flex-1 space-y-1 p-2">
            {notes.map((n, i) => (
              <li key={i} className="group flex gap-3 rounded-lg p-2 hover:bg-accent/50">
                <button className="press h-fit shrink-0 rounded-md bg-primary-soft px-1.5 py-0.5 font-mono text-[11px] text-primary">{n.t}</button>
                <p className="text-[13px] leading-relaxed">{n.text}</p>
              </li>
            ))}
          </ul>
          <form className="border-t border-border p-3" onSubmit={(e) => { e.preventDefault(); if (!draft.trim()) return; setNotes([...notes, { t: "27:34", text: draft }]); setDraft(""); }}>
            <div className="rounded-xl border border-input bg-surface focus-within:border-primary/50 focus-within:shadow-focus">
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder="Write a note at 27:34…" className="block w-full resize-none bg-transparent px-3 pt-2.5 text-[13px] outline-none placeholder:text-muted-foreground/70" />
              <div className="flex items-center justify-between px-2 pb-2">
                <span className="font-mono text-[11px] text-muted-foreground">@ 27:34</span>
                <Button size="sm" type="submit" disabled={!draft.trim()}>Save note</Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {tab === "bookmarks" && (
        <ul className="space-y-1 p-2">
          {BOOKMARKS.map((b) => (
            <li key={b.t}>
              <button className="press flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-accent/50">
                <Bookmark className="h-4 w-4 shrink-0 text-primary" fill="currentColor" />
                <span className="flex-1 text-[13px]">{b.label}</span>
                <span className="font-mono text-[11px] text-muted-foreground">{b.t}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
