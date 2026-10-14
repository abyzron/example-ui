import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowUp, GripVertical, ListPlus, Pencil, Play, Plus, Shuffle, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Header, SampleTag, SubjectDot, Thumb } from "@/components/sg/core";
import { Confirm } from "@/components/sg/dialogs";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";
import { getLecture, LECTURES } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/playlists/$id")({
  head: () => ({
    meta: [
      { title: "Manage playlist — StudyGate" },
      { name: "description", content: "Reorder, add and remove lectures in your study playlist." },
      { property: "og:title", content: "Manage playlist — StudyGate" },
      { property: "og:description", content: "Reorder, add and remove lectures in your study playlist." },
    ],
  }),
  component: Manage,
});

function Manage() {
  const { id } = Route.useParams();
  const { playlists, setPlaylists } = useApp();
  const nav = useNavigate();
  const p = playlists.find((x) => x.id === id);
  const [confirmDel, setConfirmDel] = useState(false);
  const [remove, setRemove] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  if (!p) {
    return (
      <div className="min-h-screen"><Header />
        <div className="mx-auto max-w-md py-24 text-center">
          <p className="text-sm font-medium">Playlist not found</p>
          <Button asChild size="sm" variant="outline" className="mt-4"><Link to="/">Back home</Link></Button>
        </div>
      </div>
    );
  }

  const update = (ids: string[]) => setPlaylists((all) => all.map((x) => (x.id === p.id ? { ...x, lectureIds: ids } : x)));
  const move = (i: number, d: number) => {
    const ids = [...p.lectureIds];
    [ids[i], ids[i + d]] = [ids[i + d], ids[i]];
    update(ids);
  };
  const first = p.lectureIds[0] ? getLecture(p.lectureIds[0]) : undefined;
  const available = LECTURES.filter((l) => !p.lectureIds.includes(l.id));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto grid max-w-[1100px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Library</Link>
          <div className="panel p-3">
            {first ? <Thumb lecture={first} showDuration={false} /> : <div className="grid aspect-video place-items-center rounded-xl border border-dashed border-border-strong bg-surface-2"><ListPlus className="h-5 w-5 text-muted-foreground" /></div>}
            <div className="px-1 pt-3">
              <p className="eyebrow capitalize">{p.kind} playlist</p>
              <h1 className="mt-1 text-lg leading-snug font-semibold tracking-tight">{p.name}</h1>
              <p className="mt-1 text-[13px] text-muted-foreground">{p.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">{p.lectureIds.length} lectures · updated {p.updated}</p>
            </div>
            <div className="mt-4 flex gap-1.5">
              <Button className="flex-1" disabled={!first} onClick={() => first && nav({ to: "/watch/$id", params: { id: first.id } })}><Play /> Play all</Button>
              <Button variant="outline" size="icon" aria-label="Shuffle" onClick={() => { update([...p.lectureIds].sort(() => Math.random() - 0.5)); toast("Queue shuffled"); }}><Shuffle /></Button>
              <Button variant="outline" size="icon" aria-label="Rename" onClick={() => toast("Rename — simulated")}><Pencil /></Button>
            </div>
            <button onClick={() => setConfirmDel(true)} className="press mt-2 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg text-[12.5px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" /> Delete playlist
            </button>
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Queue</h2>
            <Button size="sm" variant={adding ? "secondary" : "outline"} onClick={() => setAdding(!adding)}>{adding ? <X /> : <Plus />} {adding ? "Done" : "Add lectures"}</Button>
          </div>

          {adding && (
            <div className="panel mb-4 animate-rise p-2">
              <p className="eyebrow px-2 pt-1 pb-2">From sample catalog</p>
              <div className="grid gap-1 sm:grid-cols-2">
                {available.slice(0, 6).map((l) => (
                  <button key={l.id} onClick={() => update([...p.lectureIds, l.id])} className="press flex items-center gap-2.5 rounded-lg p-1.5 text-left hover:bg-accent/60">
                    <Thumb lecture={l} showDuration={false} className="w-16 shrink-0 rounded-md" />
                    <span className="line-clamp-2 flex-1 text-[12.5px]">{l.title}</span>
                    <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {p.lectureIds.length === 0 ? (
            <div className="panel flex flex-col items-center px-6 py-14 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary"><ListPlus className="h-5 w-5 text-muted-foreground" /></div>
              <p className="mt-4 text-sm font-medium">This playlist is empty</p>
              <p className="mt-1 max-w-xs text-[13px] text-muted-foreground">Add lectures from search or the sample catalog to build your queue.</p>
              <Button size="sm" className="mt-4" onClick={() => setAdding(true)}><Plus /> Add lectures</Button>
            </div>
          ) : (
            <ol className="panel divide-y divide-border overflow-hidden">
              {p.lectureIds.map((lid, i) => {
                const l = getLecture(lid)!;
                return (
                  <li key={lid} className="group flex items-center gap-3 px-2.5 py-2 hover:bg-accent/40">
                    <GripVertical className="hidden h-4 w-4 shrink-0 cursor-grab text-border-strong sm:block" />
                    <span className="w-5 shrink-0 text-center font-mono text-[11.5px] text-muted-foreground">{i + 1}</span>
                    <Link to="/watch/$id" params={{ id: lid }} className="w-28 shrink-0"><Thumb lecture={l} className="rounded-lg" /></Link>
                    <div className="min-w-0 flex-1">
                      <Link to="/watch/$id" params={{ id: lid }} className="line-clamp-1 text-[13.5px] font-medium hover:text-primary">{l.title}</Link>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground"><SubjectDot subject={l.subject} /> · {l.channel}</div>
                    </div>
                    <div className={cn("flex shrink-0 items-center opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100")}>
                      <QBtn label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp /></QBtn>
                      <QBtn label="Move down" disabled={i === p.lectureIds.length - 1} onClick={() => move(i, 1)}><ArrowDown /></QBtn>
                      <QBtn label="Remove" danger onClick={() => setRemove(lid)}><X /></QBtn>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          <div className="mt-3"><SampleTag>Changes are kept in this session only</SampleTag></div>
        </div>
      </main>
      <Confirm open={!!remove} onOpenChange={(o) => !o && setRemove(null)} title="Remove from playlist?" body="The lecture stays in your history and search results." action="Remove"
        onConfirm={() => update(p.lectureIds.filter((x) => x !== remove))} />
      <Confirm open={confirmDel} onOpenChange={setConfirmDel} title={`Delete “${p.name}”?`} body="Notes on these lectures are kept. This can't be undone." action="Delete playlist"
        onConfirm={() => { setPlaylists((all) => all.filter((x) => x.id !== p.id)); nav({ to: "/" }); toast("Playlist deleted"); }} />
    </div>
  );
}

function QBtn({ children, label, onClick, disabled, danger }: { children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button aria-label={label} title={label} disabled={disabled} onClick={onClick}
      className={cn("press grid h-8 w-8 place-items-center rounded-md text-muted-foreground disabled:opacity-30 [&_svg]:h-4 [&_svg]:w-4",
        danger ? "hover:bg-destructive/10 hover:text-destructive" : "hover:bg-accent hover:text-foreground")}>
      {children}
    </button>
  );
}
