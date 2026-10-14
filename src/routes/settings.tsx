import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Cpu,
  Eye,
  EyeOff,
  GraduationCap,
  Info,
  KeyRound,
  Lock,
  Moon,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Sun,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Logo, SampleTag, StudyModeToggle } from "@/components/sg/core";
import { Confirm, fieldCls } from "@/components/sg/dialogs";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useApp } from "@/lib/app-state";
import { SUBJECTS, subjectColor, type Subject } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — StudyGate" },
      { name: "description", content: "Manage AI providers, study profile, appearance and privacy." },
      { property: "og:title", content: "Settings — StudyGate" },
      { property: "og:description", content: "Manage AI providers, study profile, appearance and privacy." },
    ],
  }),
  component: Settings,
});

type Sec = "ai" | "profile" | "appearance" | "about";
const SECTIONS: { k: Sec; label: string; icon: LucideIcon; desc: string }[] = [
  { k: "ai", label: "AI Providers", icon: Cpu, desc: "Connect the models that power verification and the study assistant." },
  { k: "profile", label: "Study Profile", icon: GraduationCap, desc: "Tell StudyGate what you're studying so it can keep you on track." },
  { k: "appearance", label: "Appearance", icon: Palette, desc: "Theme, accent colour and reading comfort." },
  { k: "about", label: "About & Privacy", icon: Info, desc: "What's stored, where, and how to remove it." },
];

function Settings() {
  const [sec, setSec] = useState<Sec>("ai");
  const [collapsed, setCollapsed] = useState(false);
  const [dirty, setDirty] = useState(false);
  const cur = SECTIONS.find((s) => s.k === sec)!;
  const touch = () => setDirty(true);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 z-20 flex shrink-0 flex-col border-b border-sidebar-border bg-sidebar transition-[width] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] md:h-screen md:border-r md:border-b-0",
          collapsed ? "md:w-[68px]" : "md:w-[248px]",
        )}
      >
        <div className={cn("flex h-14 items-center px-3.5", collapsed ? "md:justify-center" : "justify-between")}>
          <div className={cn(collapsed && "md:hidden")}><Logo /></div>
          <div className={cn("hidden", collapsed && "md:block")}><Logo compact /></div>
        </div>
        <div className="px-2.5 pb-2 hidden md:block">
          <NavItem collapsed={collapsed} icon={ArrowLeft} label="Back to study" to />
        </div>
        <p className={cn("eyebrow hidden px-5 pt-3 pb-1.5 transition-opacity md:block", collapsed && "md:opacity-0")}>Settings</p>
        <nav className="flex gap-1 overflow-x-auto px-2.5 pb-2.5 md:flex-col md:overflow-visible">
          {SECTIONS.map((s) => (
            <NavItem key={s.k} collapsed={collapsed} icon={s.icon} label={s.label} active={sec === s.k} onClick={() => setSec(s.k)} />
          ))}
        </nav>
        <div className="mt-auto hidden border-t border-sidebar-border p-2.5 md:block">
          <NavItem collapsed={collapsed} icon={collapsed ? PanelLeftOpen : PanelLeftClose} label={collapsed ? "Expand sidebar" : "Collapse"} onClick={() => setCollapsed(!collapsed)} />
        </div>
      </aside>

      {/* Content */}
      <main className="min-w-0 flex-1">
        <div className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-8">
          <div className="flex min-w-0 items-center gap-2 text-[13px]">
            <Link to="/" className="text-muted-foreground hover:text-foreground md:hidden"><ArrowLeft className="h-4 w-4" /></Link>
            <span className="text-muted-foreground">Settings</span>
            <span className="text-border-strong">/</span>
            <span className="truncate font-medium">{cur.label}</span>
          </div>
          <StudyModeToggle size="sm" />
        </div>
        <div key={sec} className="mx-auto max-w-[760px] animate-rise px-4 py-8 sm:px-8">
          <h1 className="text-2xl font-semibold tracking-tight">{cur.label}</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">{cur.desc}</p>
          <div className="mt-7 space-y-5">
            {sec === "ai" && <AIProviders touch={touch} />}
            {sec === "profile" && <Profile touch={touch} />}
            {sec === "appearance" && <Appearance />}
            {sec === "about" && <About />}
          </div>
        </div>
        {/* Save bar */}
        <div className={cn("pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center px-4 transition-all duration-300",
          dirty ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
          <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-border bg-popover py-1.5 pr-1.5 pl-4 shadow-lift">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            <span className="text-[13px]">Unsaved changes</span>
            <Button variant="ghost" size="sm" onClick={() => setDirty(false)}>Discard</Button>
            <Button size="sm" onClick={() => { setDirty(false); toast.success("Settings saved", { description: "Stored locally in this prototype." }); }}>Save</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ collapsed, icon: Icon, label, active, onClick, to }: { collapsed: boolean; icon: LucideIcon; label: string; active?: boolean; onClick?: () => void; to?: boolean }) {
  const cls = cn(
    "press group relative flex h-9 shrink-0 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] font-medium",
    collapsed && "md:w-[44px] md:justify-center md:px-0",
    active
      ? "bg-sidebar-accent text-foreground shadow-soft ring-1 ring-border"
      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
  );
  const inner = (
    <>
      {active && <span className="absolute top-2 bottom-2 left-0 hidden w-[3px] rounded-r-full bg-primary md:block" />}
      <Icon className={cn("h-[17px] w-[17px] shrink-0", active && "text-primary")} strokeWidth={1.8} />
      <span className={cn("truncate transition-opacity duration-200", collapsed && "md:hidden")}>{label}</span>
    </>
  );
  const el = to ? <Link to="/" className={cls}>{inner}</Link> : <button onClick={onClick} className={cls}>{inner}</button>;
  if (!collapsed) return el;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{el}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function Card({ title, desc, right, children }: { title: string; desc?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="panel">
      <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3">
        <div className="min-w-0">
          <h2 className="text-[14.5px] font-semibold">{title}</h2>
          {desc && <p className="mt-0.5 text-[13px] text-muted-foreground">{desc}</p>}
        </div>
        {right}
      </div>
      <div className="px-5 pb-5">{children}</div>
    </section>
  );
}

function Status({ tone, children }: { tone: "ok" | "off" | "warn"; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border px-2 text-[11.5px] font-medium",
      tone === "ok" && "border-success/25 bg-success/10 text-success",
      tone === "warn" && "border-warning/25 bg-warning/10 text-warning",
      tone === "off" && "border-border bg-secondary text-muted-foreground")}>
      <span className={cn("h-1.5 w-1.5 rounded-full", tone === "ok" ? "bg-success" : tone === "warn" ? "bg-warning" : "bg-border-strong")} />
      {children}
    </span>
  );
}

function AIProviders({ touch }: { touch: () => void }) {
  const [keys, setKeys] = useState([
    { id: 1, label: "Primary", key: "AIza-DEMO-••••••••••••-7f2a", status: "ok" as const, used: "62%" },
    { id: 2, label: "Backup", key: "AIza-DEMO-••••••••••••-c19e", status: "warn" as const, used: "Rate limited" },
  ]);
  const [del, setDel] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [connecting, setConnecting] = useState(false);
  return (
    <>
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-2 px-3.5 py-2.5 text-[12.5px] text-muted-foreground">
        <Lock className="h-3.5 w-3.5 shrink-0" /> All keys shown here are fictional placeholders. Nothing is sent or stored.
      </div>
      <Card title="Google Gemini" desc="Used for curriculum verification and the study assistant." right={<Status tone="ok">Connected</Status>}>
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center gap-3 bg-surface-2/60 px-3.5 py-2.5">
              <KeyRound className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium">{k.label}</p>
                <p className="truncate font-mono text-[11.5px] text-muted-foreground">{k.key}</p>
              </div>
              <Status tone={k.status}>{k.used}</Status>
              <button onClick={() => setDel(k.id)} aria-label="Remove key" className="press grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setKeys([...keys, { id: Date.now(), label: `Key ${keys.length + 1}`, key: "AIza-DEMO-••••••••••••-0000", status: "ok", used: "Unused" }]); touch(); }}>
          <Plus /> Add another key
        </Button>
        <p className="mt-1 text-[12px] text-muted-foreground">Keys rotate automatically when one hits its limit.</p>
      </Card>

      <Card title="OpenAI-compatible endpoint" desc="Optional fallback for the study assistant." right={<Status tone="off">Not configured</Status>}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-medium">Base URL</span>
            <input onChange={touch} placeholder="https://api.example.com/v1" className={fieldCls} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium">Model</span>
            <select onChange={touch} className={fieldCls}>
              <option>example-model-large</option>
              <option>example-model-mini</option>
            </select>
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-xs font-medium">API key</span>
            <div className="relative">
              <input type={show ? "text" : "password"} onChange={touch} placeholder="Paste a key (demo only)" className={fieldCls + " pr-10 font-mono"} />
              <button type="button" onClick={() => setShow(!show)} className="absolute top-1/2 right-2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-accent">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <SampleTag>Simulated connection</SampleTag>
          <Button size="sm" variant="outline" disabled={connecting}
            onClick={() => { setConnecting(true); setTimeout(() => { setConnecting(false); toast.error("Couldn't connect", { description: "Example error state — no request was made." }); }, 1000); }}>
            {connecting ? "Testing…" : "Test connection"}
          </Button>
        </div>
      </Card>
      <Confirm open={del !== null} onOpenChange={(o) => !o && setDel(null)} title="Remove this key?" body="StudyGate will stop using it for verification and the assistant." action="Remove key"
        onConfirm={() => { setKeys(keys.filter((k) => k.id !== del)); touch(); }} />
    </>
  );
}

function Seg<T extends string>({ value, options, onChange }: { value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-lg bg-secondary p-0.5">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={cn("press h-8 rounded-md px-3 text-[13px] font-medium",
          value === o ? "bg-surface text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground")}>{o}</button>
      ))}
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-border py-4 last:border-0 last:pb-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-[13.5px] font-medium">{label}</p>
        {hint && <p className="text-[12.5px] text-muted-foreground">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Profile({ touch }: { touch: () => void }) {
  const [cls, setCls] = useState<"Class 11" | "Class 12">("Class 12");
  const [strict, setStrict] = useState<"Relaxed" | "Balanced" | "Strict">("Balanced");
  const [subs, setSubs] = useState<Subject[]>(["Physics", "Chemistry", "Biology"]);
  return (
    <>
      <Card title="Academic details">
        <Row label="Class"><Seg value={cls} options={["Class 11", "Class 12"]} onChange={(v) => { setCls(v); touch(); }} /></Row>
        <Row label="Board">
          <select onChange={touch} className={fieldCls + " w-52"}><option>CBSE</option><option>ICSE</option><option>State board</option></select>
        </Row>
        <Row label="Exam goal" hint="Used to prioritise relevant lectures.">
          <input defaultValue="NEET 2027" onChange={touch} className={fieldCls + " w-52"} />
        </Row>
      </Card>
      <Card title="Subjects" desc="Study Mode only allows lectures from these subjects.">
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => {
            const on = subs.includes(s);
            return (
              <button key={s} onClick={() => { setSubs(on ? subs.filter((x) => x !== s) : [...subs, s]); touch(); }}
                className={cn("press inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium",
                  on ? "border-primary/40 bg-primary-soft text-foreground" : "border-border text-muted-foreground hover:border-border-strong")}>
                <span className={cn("grid h-4 w-4 place-items-center rounded border", on ? "border-primary bg-primary text-primary-foreground" : "border-border-strong")}>
                  {on && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <span className={cn("h-1.5 w-1.5 rounded-full", subjectColor[s])} />{s}
              </button>
            );
          })}
        </div>
      </Card>
      <Card title="Verification strictness" desc="How closely a lecture must match your syllabus.">
        <Seg value={strict} options={["Relaxed", "Balanced", "Strict"]} onChange={(v) => { setStrict(v); touch(); }} />
        <p className="mt-3 text-[12.5px] text-muted-foreground">
          {strict === "Relaxed" && "Allows related enrichment content and general explainers."}
          {strict === "Balanced" && "Allows on-syllabus lectures; asks for review when partially relevant."}
          {strict === "Strict" && "Only lectures that clearly match a chapter in your syllabus."}
        </p>
      </Card>
    </>
  );
}

const PRESETS = [
  { name: "Terracotta", h: 45, c: 0.125 },
  { name: "Sage", h: 150, c: 0.07 },
  { name: "Ocean", h: 235, c: 0.09 },
  { name: "Plum", h: 345, c: 0.09 },
  { name: "Amber", h: 75, c: 0.13 },
];

function Appearance() {
  const { dark, setDark, accentHue, accentChroma, setAccent } = useApp();
  return (
    <>
      <Card title="Theme">
        <div className="grid grid-cols-2 gap-3">
          {[{ d: false, label: "Warm light", icon: Sun }, { d: true, label: "Charcoal", icon: Moon }].map((t) => (
            <button key={t.label} onClick={() => setDark(t.d)}
              className={cn("press overflow-hidden rounded-xl border text-left", dark === t.d ? "border-primary ring-2 ring-primary/25" : "border-border hover:border-border-strong")}>
              <div className={cn("p-3", t.d ? "dark" : "")}>
                <div className="rounded-lg border border-border bg-background p-2.5">
                  <div className="h-2 w-12 rounded bg-foreground/80" />
                  <div className="mt-2 flex gap-1.5"><div className="h-6 flex-1 rounded-md border border-border bg-surface" /><div className="h-6 w-8 rounded-md bg-primary" /></div>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-border px-3 py-2 text-[13px] font-medium"><t.icon className="h-4 w-4 text-muted-foreground" />{t.label}{dark === t.d && <Check className="ml-auto h-4 w-4 text-primary" />}</div>
            </button>
          ))}
        </div>
      </Card>
      <Card title="Accent colour" desc="Presets, or tune your own.">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const on = Math.round(accentHue) === p.h && accentChroma === p.c;
            return (
              <button key={p.name} onClick={() => setAccent(p.h, p.c)}
                className={cn("press flex h-9 items-center gap-2 rounded-lg border pr-3 pl-1.5 text-[13px] font-medium", on ? "border-foreground/60" : "border-border hover:border-border-strong")}>
                <span className="h-6 w-6 rounded-md" style={{ background: `oklch(0.63 ${p.c} ${p.h})` }} />{p.name}
              </button>
            );
          })}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_200px]">
          <div className="space-y-4">
            <Slider label="Hue" value={accentHue} min={0} max={360} step={1} onChange={(v) => setAccent(v)} display={`${Math.round(accentHue)}°`} track="linear-gradient(90deg, oklch(0.65 0.12 0), oklch(0.65 0.12 90), oklch(0.65 0.12 180), oklch(0.65 0.12 270), oklch(0.65 0.12 360))" />
            <Slider label="Intensity" value={accentChroma} min={0.02} max={0.18} step={0.005} onChange={(v) => setAccent(accentHue, v)} display={accentChroma.toFixed(3)} track={`linear-gradient(90deg, oklch(0.63 0.02 ${accentHue}), oklch(0.63 0.18 ${accentHue}))`} />
          </div>
          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <p className="eyebrow">Preview</p>
            <Button size="sm" className="mt-2 w-full">Primary action</Button>
            <div className="mt-2 flex gap-1.5"><span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">Study Mode</span><span className="font-mono text-[11px] text-primary">12:04</span></div>
          </div>
        </div>
      </Card>
    </>
  );
}

function Slider({ label, value, min, max, step, onChange, display, track }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string; track: string }) {
  return (
    <label className="block">
      <div className="mb-2 flex justify-between text-xs"><span className="font-medium">{label}</span><span className="font-mono text-muted-foreground">{display}</span></div>
      <input type="range" value={value} min={min} max={max} step={step} onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full accent-primary" style={{ background: track }} />
    </label>
  );
}

function About() {
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <Card title="Your data">
        <Row label="Notes & bookmarks" hint="Stored on this device only."><span className="text-[13px] text-muted-foreground">Local</span></Row>
        <Row label="Watch history" hint="Used to resume lessons."><span className="text-[13px] text-muted-foreground">Local</span></Row>
        <Row label="API keys" hint="Sent directly to the provider you configure — never to StudyGate."><span className="text-[13px] text-muted-foreground">Local</span></Row>
        <Row label="Erase all local data">
          <Button variant="outline" size="sm" className="text-destructive" onClick={() => setConfirm(true)}><Trash2 /> Erase data</Button>
        </Row>
      </Card>
      <Card title="About StudyGate">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="font-mono text-xs text-muted-foreground">v2.0 · design concept</span>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
          StudyGate is a focused study workspace. Study Mode verifies lectures against your curriculum before playback. This page is a UI prototype — all states, results and credentials are illustrative.
        </p>
      </Card>
      <Confirm open={confirm} onOpenChange={setConfirm} title="Erase all local data?" body="Notes, bookmarks, history and keys will be removed from this device. This can't be undone." action="Erase everything"
        onConfirm={() => toast("Data erased", { description: "Simulated — nothing was removed." })} />
    </>
  );
}
