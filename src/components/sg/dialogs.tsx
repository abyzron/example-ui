import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { History, Link2, ListPlus, Play, RotateCcw, Trash2, Youtube } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";
import { getLecture, INITIAL_HISTORY } from "@/lib/data";
import { SampleTag, Thumb } from "./core";

export const fieldCls =
  "h-10 w-full rounded-lg border border-input bg-surface px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-primary/60 focus:shadow-focus";

export function AppDialogs() {
  const { dialog, openDialog } = useApp();
  const close = (o: boolean) => !o && openDialog(null);
  return (
    <>
      <HistoryDialog open={dialog === "history"} onOpenChange={close} />
      <ImportDialog open={dialog === "import"} onOpenChange={close} />
      <CreateDialog open={dialog === "create"} onOpenChange={close} />
    </>
  );
}

type DP = { open: boolean; onOpenChange: (o: boolean) => void };

function HistoryDialog({ open, onOpenChange }: DP) {
  const { history, setHistory } = useApp();
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl gap-0 overflow-hidden rounded-2xl p-0">
          <DialogHeader className="border-b border-border px-5 py-4 text-left">
            <DialogTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4 text-muted-foreground" /> Watch history
            </DialogTitle>
            <DialogDescription className="text-[13px]">Pick up exactly where you left off.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {history.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-12 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary">
                  <History className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm font-medium">No lessons watched yet</p>
                <p className="mt-1 max-w-xs text-[13px] text-muted-foreground">
                  Lectures you open will appear here with your progress.
                </p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setHistory(INITIAL_HISTORY)}>
                  Restore sample history
                </Button>
              </div>
            ) : (
              history.map((h) => {
                const l = getLecture(h.lectureId)!;
                const done = h.progress >= 100;
                return (
                  <div key={h.lectureId} className="group flex items-center gap-3 rounded-xl p-2 hover:bg-accent/60">
                    <Thumb lecture={l} progress={h.progress} showDuration={false} className="w-32 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-[13.5px] font-medium">{l.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {l.channel} · {h.watched}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-muted-foreground tabular-nums">
                        {done ? "Completed" : `${h.progress}% watched`}
                      </p>
                    </div>
                    <Button asChild size="sm" variant={done ? "outline" : "soft"} className="shrink-0">
                      <Link to="/watch/$id" params={{ id: l.id }} onClick={() => onOpenChange(false)}>
                        {done ? <RotateCcw /> : <Play />}
                        {done ? "Replay" : "Resume"}
                      </Link>
                    </Button>
                  </div>
                );
              })
            )}
          </div>
          {history.length > 0 && (
            <div className="flex items-center justify-between border-t border-border px-5 py-3">
              <SampleTag />
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setConfirm(true)}>
                <Trash2 /> Clear history
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Confirm
        open={confirm}
        onOpenChange={setConfirm}
        title="Clear watch history?"
        body="This removes all progress from this device. Notes and bookmarks are kept."
        action="Clear history"
        onConfirm={() => {
          setHistory([]);
          toast("History cleared", { description: "Simulated — nothing was deleted." });
        }}
      />
    </>
  );
}

export function Confirm({
  open,
  onOpenChange,
  title,
  body,
  action,
  onConfirm,
}: DP & { title: string; body: string; action: string; onConfirm: () => void }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-[13px]">{body}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-9 rounded-lg">Cancel</AlertDialogCancel>
          <AlertDialogAction className="h-9 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={onConfirm}>
            {action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ImportDialog({ open, onOpenChange }: DP) {
  const { setPlaylists } = useApp();
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "preview">("idle");
  const sample = ["l3", "l2", "l1"];
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setState("idle"); setUrl(""); } }}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader className="text-left">
          <div className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
            <Youtube className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base">Import a YouTube playlist</DialogTitle>
          <DialogDescription className="text-[13px]">Paste a playlist link. Every lecture becomes part of your queue.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Link2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="youtube.com/playlist?list=…" className={fieldCls + " pl-9"} />
        </div>
        {state === "loading" && (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex animate-pulse items-center gap-3">
                <div className="h-9 w-16 rounded-md bg-secondary" />
                <div className="h-3 flex-1 rounded bg-secondary" />
              </div>
            ))}
          </div>
        )}
        {state === "preview" && (
          <div className="animate-rise rounded-xl border border-border bg-surface-2 p-2">
            <p className="px-1.5 pt-1 pb-2 text-xs text-muted-foreground">Mechanics Crash Course · 3 lectures</p>
            {sample.map((id) => {
              const l = getLecture(id)!;
              return (
                <div key={id} className="flex items-center gap-3 rounded-lg p-1.5">
                  <Thumb lecture={l} showDuration={false} className="w-16 shrink-0 rounded-md" />
                  <p className="line-clamp-1 text-[13px]">{l.title}</p>
                </div>
              );
            })}
          </div>
        )}
        <DialogFooter className="items-center gap-2 sm:justify-between">
          <SampleTag>Simulated import</SampleTag>
          {state === "preview" ? (
            <Button
              onClick={() => {
                setPlaylists((p) => [
                  { id: "p" + Date.now(), name: "Mechanics Crash Course", description: "Imported from YouTube", lectureIds: sample, kind: "imported", updated: "Just now" },
                  ...p,
                ]);
                toast.success("Playlist imported", { description: "Sample playlist added to your library." });
                onOpenChange(false);
                setState("idle");
              }}
            >
              Add to library
            </Button>
          ) : (
            <Button
              disabled={state === "loading"}
              onClick={() => {
                setState("loading");
                setTimeout(() => setState("preview"), 900);
              }}
            >
              {state === "loading" ? "Fetching…" : "Fetch playlist"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateDialog({ open, onOpenChange }: DP) {
  const { setPlaylists } = useApp();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader className="text-left">
          <div className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-secondary text-foreground">
            <ListPlus className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base">New study playlist</DialogTitle>
          <DialogDescription className="text-[13px]">Group lectures for a chapter, test, or revision sprint.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium">Name</span>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Thermodynamics sprint" className={fieldCls} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium">Description <span className="text-muted-foreground">(optional)</span></span>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} className={fieldCls + " h-auto py-2"} />
          </label>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!name.trim()}
            onClick={() => {
              setPlaylists((p) => [{ id: "p" + Date.now(), name, description: desc || "Custom playlist", lectureIds: [], kind: "custom", updated: "Just now" }, ...p]);
              toast.success("Playlist created");
              setName("");
              setDesc("");
              onOpenChange(false);
            }}
          >
            Create playlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
