import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CloudOff, ListPlus, Play, SearchX } from "lucide-react";
import { toast } from "sonner";
import { Header, PlainBadge, SampleTag, SubjectDot, Thumb } from "@/components/sg/core";
import { SearchBox, SubjectFilters } from "@/components/sg/search-box";
import { Button } from "@/components/ui/button";
import { LECTURES, SUBJECTS, type Subject } from "@/lib/data";
import { cn } from "@/lib/utils";

type S = { q?: string; subject?: Subject };

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): S => ({
    q: typeof s.q === "string" ? s.q : undefined,
    subject: SUBJECTS.includes(s.subject as Subject) ? (s.subject as Subject) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Search lectures — StudyGate" },
      { name: "description", content: "Browse sample lecture results by subject, channel and duration." },
      { property: "og:title", content: "Search lectures — StudyGate" },
      { property: "og:description", content: "Browse sample lecture results by subject, channel and duration." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "", subject } = Route.useSearch();
  const nav = useNavigate({ from: "/search" });
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState<"live" | "error">("live");

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, [q, subject]);

  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const results = LECTURES.filter(
    (l) =>
      (!subject || l.subject === subject) &&
      (words.length === 0 || words.some((w) => `${l.title} ${l.channel} ${l.subject}`.toLowerCase().includes(w))),
  );

  return (
    <div className="min-h-screen">
      <Header>
        <div className="mx-auto hidden max-w-md md:block">
          <SearchBox key={q} initial={q} subject={subject} size="md" />
        </div>
      </Header>
      <main className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6">
        <div className="mb-4 md:hidden">
          <SearchBox key={q} initial={q} subject={subject} size="md" />
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight">
              {q ? <>Results for <span className="font-display font-normal italic">“{q}”</span></> : "All lectures"}
            </h1>
            <p className="mt-0.5 flex items-center gap-2 text-[13px] text-muted-foreground">
              {loading ? "Searching…" : `${results.length} lectures`} <SampleTag>Sample catalog — not live</SampleTag>
            </p>
          </div>
          <SubjectFilters value={subject} onChange={(s) => nav({ search: { q, subject: s } })} />
        </div>

        <div className="mt-6">
          {demo === "error" ? (
            <State icon={CloudOff} title="Couldn't reach search" body="The lecture service didn't respond. Check your connection and try again.">
              <Button size="sm" variant="outline" onClick={() => setDemo("live")}>Try again</Button>
            </State>
          ) : loading ? (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex animate-pulse gap-4 rounded-2xl p-2">
                  <div className="aspect-video w-40 shrink-0 rounded-xl bg-secondary sm:w-60" />
                  <div className="flex-1 space-y-2.5 py-2">
                    <div className="h-4 w-2/3 rounded bg-secondary" />
                    <div className="h-3 w-1/3 rounded bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <State icon={SearchX} title="No lectures match" body="Try a broader topic, remove the subject filter, or paste a video URL.">
              <Button size="sm" variant="outline" onClick={() => nav({ search: {} })}>Clear search</Button>
            </State>
          ) : (
            <ul className="divide-y divide-border/70">
              {results.map((l, i) => (
                <li key={l.id} className="animate-rise" style={{ animationDelay: `${i * 35}ms` }}>
                  <div className="group flex gap-4 rounded-2xl p-2 transition-colors hover:bg-accent/50">
                    <Link to="/watch/$id" params={{ id: l.id }} className="w-36 shrink-0 sm:w-60">
                      <Thumb lecture={l} className="transition-transform duration-300 group-hover:scale-[1.015]" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col py-1">
                      <Link to="/watch/$id" params={{ id: l.id }} className="line-clamp-2 text-[15px] leading-snug font-medium hover:text-primary">
                        {l.title}
                      </Link>
                      <p className="mt-1 text-[13px] text-muted-foreground">{l.channel} · {l.views} views</p>
                      <div className="mt-2 hidden flex-wrap items-center gap-2 sm:flex">
                        <SubjectDot subject={l.subject} className="text-muted-foreground" />
                        <span className="text-border-strong">·</span>
                        <span className="text-xs text-muted-foreground">{l.chapter}</span>
                        <span className="text-border-strong">·</span>
                        <span className="font-mono text-xs text-muted-foreground">{l.duration}</span>
                      </div>
                      <div className="mt-auto flex gap-1.5 pt-3 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                        <Button asChild size="sm"><Link to="/watch/$id" params={{ id: l.id }}><Play /> Watch</Link></Button>
                        <Button size="sm" variant="outline" onClick={() => toast.success("Added to “Boards Revision — Physics”", { description: "Simulated action" })}>
                          <ListPlus /> <span className="hidden sm:inline">Add to playlist</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-border pt-4">
          <PlainBadge>Preview states</PlainBadge>
          <div className="flex gap-0.5 rounded-lg bg-secondary p-0.5">
            {[["live", "Results"], ["error", "Error"]].map(([k, l]) => (
              <button key={k} onClick={() => setDemo(k as "live" | "error")}
                className={cn("press h-6 rounded-md px-2 text-[11.5px] font-medium", demo === k ? "bg-surface shadow-soft" : "text-muted-foreground")}>
                {l}
              </button>
            ))}
            <button onClick={() => nav({ search: { q: "zzqx" } })} className="press h-6 rounded-md px-2 text-[11.5px] font-medium text-muted-foreground">Empty</button>
          </div>
        </div>
      </main>
    </div>
  );
}

function State({ icon: Icon, title, body, children }: { icon: typeof SearchX; title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="panel flex flex-col items-center px-6 py-14 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="mt-4 text-sm font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">{body}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
