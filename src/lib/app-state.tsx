import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { INITIAL_HISTORY, INITIAL_PLAYLISTS, type HistoryItem, type Playlist } from "./data";

export type Dialogs = "history" | "import" | "create" | null;

interface AppState {
  dark: boolean;
  setDark: (v: boolean) => void;
  studyMode: boolean;
  setStudyMode: (v: boolean) => void;
  accentHue: number;
  accentChroma: number;
  setAccent: (h: number, c?: number) => void;
  playlists: Playlist[];
  setPlaylists: (fn: (p: Playlist[]) => Playlist[]) => void;
  history: HistoryItem[];
  setHistory: (h: HistoryItem[]) => void;
  dialog: Dialogs;
  openDialog: (d: Dialogs) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const [studyMode, setStudyMode] = useState(true);
  const [accentHue, setHue] = useState(45);
  const [accentChroma, setChroma] = useState(0.125);
  const [playlists, setPl] = useState(INITIAL_PLAYLISTS);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [dialog, openDialog] = useState<Dialogs>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  useEffect(() => {
    const s = document.documentElement.style;
    s.setProperty("--accent-h", String(accentHue));
    s.setProperty("--accent-c", String(accentChroma));
  }, [accentHue, accentChroma]);

  return (
    <Ctx.Provider
      value={{
        dark,
        setDark,
        studyMode,
        setStudyMode,
        accentHue,
        accentChroma,
        setAccent: (h, c) => {
          setHue(h);
          if (c !== undefined) setChroma(c);
        },
        playlists,
        setPlaylists: (fn) => setPl(fn),
        history,
        setHistory,
        dialog,
        openDialog,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}
