import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Download, ListMusic, Plus, Sparkles } from "lucide-react";
import { Header, SampleTag, Thumb } from "@/components/sg/core";
import { SearchBox, SubjectFilters } from "@/components/sg/search-box";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";
import { getLecture, type Playlist, type Subject } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudyGate — Find your next lecture" },
      { name: "description", content: "Search curriculum-aligned YouTube lectures and organise focused study playlists." },
      { property: "og:title", content: "StudyGate — Find your next lecture" },
      { property: "og:description", content: "Search curriculum-aligned YouTube lectures and organise focused study playlists." },
    ],
  }),
  component: Home,
});

const SUGGEST = ["Electrostatic potential", "SN1 vs SN2", "DNA replication", "Lens maker's formula"];
type Tab = "all" | Playlist["kind"];

function Home() {
  const [subject, setSubject] = useState<Subject | undefined>();
  const { playlists, openDialog, studyMode } = useApp();
  const [tab, setTab] = useState<Tab>("all");
  const [demo, setDemo] = useState<"populated" | "loading" | "empty">("populated");
  const list = demo === "empty" ? [] : playlists.filter((p) => tab === "all" || p.kind === tab);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <section className="mx-auto max-w-2xl pt-14 pb-10 text-center sm:pt-20">
          <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
            studyMode ? "border-primary/25 bg-primary-soft text-primary" : "border-border bg-secondary text-muted-foreground")}>
            <Sparkles className="h-3.5 w-3.5" />
            {studyMode ? "Study Mode is on — lectures are checked before playback" : "Study Mode is off — standard playback"}
          </span>
          <h1 className="mt-5 text-[34px] leading-[1.1] font-semibold tracking-[-0.025em] sm:text-[44px]">
            What are you <span className="font-display font-normal italic text-primary">learning</span> today?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-muted-foreground">
            Find focused lectures, queue them up, and take notes without leaving the page.
          </p>
          <div className="mt-8 text-left">
            <SearchBox subject={subject} />
          </div>
          <div className="mt-4 flex justify-center">
            <SubjectFilters value={subject} onChange={setSubject} />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
            <span>Try</span>
            {SUGGEST.map((s) => (
              <Link key={s} to="/search" search={{ q: s, subject }} className="underline decoration-border-strong underline-offset-4 hover:text-foreground hover:decoration-primary">
                {s}
              </Link>
            ))}
          </div>
        </section>

        <section className="panel mb-16 overflow-hidden">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <ListMusic className="h-4 w-4 shrink-0 text-muted-foreground" />
              <h2 className="truncate text-[15px] font-semibold">Study playlists</h2>
              <div className="hidden items-center gap-0.5 rounded-lg bg-secondary p-0.5 md:flex">
                {(["all", "recent", "custom", "imported"] as Tab[]).map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={cn("press h-7 rounded-md px-2.5 text-[12.5px] font-medium capitalize",
                      tab === t ? "bg-surface text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground")}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" onClick={() => openDialog("import")}><Download /> <span className="hidden sm:inline">Import</span></Button>
              <Button size="sm" onClick={() => openDialog("create")}><Plus /> <span className="hidden sm:inline">New playlist</span></Button>
            </div>
          </div>

          <div className="p-3 sm:p-4">
            {demo === "loading" ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse space-y-2.5 p-1">
                    <div className="aspect-video rounded-xl bg-secondary" />
                    <div className="h-3 w-3/4 rounded bg-secondary" />
                    <div className="h-3 w-1/2 rounded bg-secondary" />
                  </div>
                ))}
              </div>
            ) : list.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary">
                  <ListMusic className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm font-medium">No playlists here yet</p>
                <p className="mt-1 max-w-xs text-[13px] text-muted-foreground">Create one for your next chapter, or import a playlist from YouTube.</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openDialog("import")}>Import</Button>
                  <Button size="sm" onClick={() => openDialog("create")}>Create playlist</Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {list.map((p, i) => <PlaylistCard key={p.id} p={p} i={i} />)}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface-2 px-4 py-2.5 sm:px-5">
            <SampleTag>Preview states</SampleTag>
            <div className="flex gap-0.5 rounded-lg bg-secondary p-0.5">
              {(["populated", "loading", "empty"] as const).map((d) => (
                <button key={d} onClick={() => setDemo(d)}
                  className={cn("press h-6 rounded-md px-2 text-[11.5px] font-medium capitalize",
                    demo === d ? "bg-surface text-foreground shadow-soft" : "text-muted-foreground")}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function PlaylistCard({ p, i }: { p: Playlist; i: number }) {
  const first = p.lectureIds[0] ? getLecture(p.lectureIds[0]) : undefined;
  return (
    <Link to="/playlists/$id" params={{ id: p.id }} className="group animate-rise rounded-xl p-1 transition-colors hover:bg-accent/60" style={{ animationDelay: `${i * 40}ms` }}>
      <div className="relative">
        {first ? (
          <Thumb lecture={first} showDuration={false} />
        ) : (
          <div className="grid aspect-video place-items-center rounded-xl border border-dashed border-border-strong bg-surface-2 text-muted-foreground">
            <Plus className="h-5 w-5" />
          </div>
        )}
        <span className="absolute right-2 bottom-2 rounded-md bg-player/80 px-1.5 py-0.5 text-[10.5px] font-medium text-player-foreground">
          {p.lectureIds.length} lectures
        </span>
        <span className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-surface text-foreground opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="px-1 pt-2.5 pb-1">
        <p className="line-clamp-1 text-[13.5px] font-medium">{p.name}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
          <span className="capitalize">{p.kind}</span> · {p.updated}
        </p>
      </div>
    </Link>
  );
}
