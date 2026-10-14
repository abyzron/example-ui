export type Subject = "Physics" | "Chemistry" | "Biology" | "English" | "Hindi";
export const SUBJECTS: Subject[] = ["Physics", "Chemistry", "Biology", "English", "Hindi"];

export const subjectColor: Record<Subject, string> = {
  Physics: "bg-subj-physics",
  Chemistry: "bg-subj-chemistry",
  Biology: "bg-subj-biology",
  English: "bg-subj-english",
  Hindi: "bg-subj-hindi",
};
export const subjectText: Record<Subject, string> = {
  Physics: "text-subj-physics",
  Chemistry: "text-subj-chemistry",
  Biology: "text-subj-biology",
  English: "text-subj-english",
  Hindi: "text-subj-hindi",
};

export interface Lecture {
  id: string;
  title: string;
  channel: string;
  subject: Subject;
  duration: string;
  views: string;
  chapter: string;
  glyph: string;
}

export const LECTURES: Lecture[] = [
  { id: "l1", title: "Electrostatic Potential & Capacitance — Complete Chapter", channel: "Vidya Physics", subject: "Physics", duration: "1:12:40", views: "412K", chapter: "Class 12 · Ch. 2", glyph: "ε₀" },
  { id: "l2", title: "Ray Optics: Lens Maker's Formula Derived Step by Step", channel: "Concept Lab", subject: "Physics", duration: "38:15", views: "189K", chapter: "Class 12 · Ch. 9", glyph: "f" },
  { id: "l3", title: "Kinematics in Two Dimensions — Projectile Motion", channel: "Vidya Physics", subject: "Physics", duration: "52:08", views: "640K", chapter: "Class 11 · Ch. 4", glyph: "v⃗" },
  { id: "l4", title: "Chemical Bonding: VSEPR Theory and Hybridisation", channel: "Molecule Room", subject: "Chemistry", duration: "46:30", views: "305K", chapter: "Class 11 · Ch. 4", glyph: "sp³" },
  { id: "l5", title: "Electrochemistry — Nernst Equation with Solved Problems", channel: "Molecule Room", subject: "Chemistry", duration: "58:12", views: "221K", chapter: "Class 12 · Ch. 3", glyph: "E°" },
  { id: "l6", title: "Organic Reaction Mechanisms: SN1 vs SN2", channel: "Carbon Classes", subject: "Chemistry", duration: "41:47", views: "512K", chapter: "Class 12 · Ch. 10", glyph: "Nu⁻" },
  { id: "l7", title: "Molecular Basis of Inheritance — DNA Replication", channel: "BioBench", subject: "Biology", duration: "49:22", views: "377K", chapter: "Class 12 · Ch. 6", glyph: "ATGC" },
  { id: "l8", title: "Photosynthesis in Higher Plants: Calvin Cycle", channel: "BioBench", subject: "Biology", duration: "35:10", views: "268K", chapter: "Class 11 · Ch. 13", glyph: "C₃" },
  { id: "l9", title: "The Last Lesson — Detailed Explanation & Themes", channel: "Literature Lane", subject: "English", duration: "28:44", views: "154K", chapter: "Flamingo · Ch. 1", glyph: "Aa" },
  { id: "l10", title: "Notice & Report Writing — Formats and Examples", channel: "Literature Lane", subject: "English", duration: "22:05", views: "98K", chapter: "Writing Skills", glyph: "¶" },
  { id: "l11", title: "Sandhi aur Samaas — Sampoorn Vyakaran", channel: "Hindi Pathshala", subject: "Hindi", duration: "44:18", views: "201K", chapter: "Vyakaran", glyph: "अ" },
  { id: "l12", title: "Kabir ke Dohe — Vyakhya aur Bhavarth", channel: "Hindi Pathshala", subject: "Hindi", duration: "31:36", views: "87K", chapter: "Aroh · Path 1", glyph: "क" },
];

export const getLecture = (id: string) => LECTURES.find((l) => l.id === id);

export interface Playlist {
  id: string;
  name: string;
  description: string;
  lectureIds: string[];
  kind: "recent" | "custom" | "imported";
  updated: string;
}

export const INITIAL_PLAYLISTS: Playlist[] = [
  { id: "p1", name: "Boards Revision — Physics", description: "High-weightage chapters before prelims", lectureIds: ["l1", "l2", "l3"], kind: "custom", updated: "2h ago" },
  { id: "p2", name: "Organic in 7 days", description: "Imported from YouTube", lectureIds: ["l6", "l4", "l5"], kind: "imported", updated: "Yesterday" },
  { id: "p3", name: "Genetics deep-dive", description: "Unit 7 — inheritance & evolution", lectureIds: ["l7", "l8"], kind: "custom", updated: "3d ago" },
  { id: "p4", name: "English literature", description: "Flamingo prose", lectureIds: ["l9", "l10"], kind: "recent", updated: "Last week" },
];

export interface HistoryItem {
  lectureId: string;
  progress: number;
  watched: string;
}

export const INITIAL_HISTORY: HistoryItem[] = [
  { lectureId: "l1", progress: 64, watched: "Today, 9:40" },
  { lectureId: "l6", progress: 100, watched: "Yesterday" },
  { lectureId: "l7", progress: 22, watched: "Yesterday" },
  { lectureId: "l9", progress: 88, watched: "Mon" },
  { lectureId: "l4", progress: 41, watched: "Sun" },
];

export const NOTES = [
  { t: "04:12", text: "Potential is scalar — add algebraically, no vector sum." },
  { t: "17:48", text: "Equipotential surfaces ⟂ field lines. Work done along one = 0." },
  { t: "31:05", text: "C = ε₀A/d. Dielectric multiplies by K — remember for numericals." },
];

export const BOOKMARKS = [
  { t: "09:30", label: "Dipole potential derivation" },
  { t: "26:15", label: "Solved PYQ 2023" },
  { t: "48:02", label: "Series vs parallel capacitors" },
];

export const CHAPTERS = [
  { t: "00:00", label: "Introduction" },
  { t: "09:30", label: "Potential due to a dipole" },
  { t: "17:48", label: "Equipotential surfaces" },
  { t: "31:05", label: "Capacitors & dielectrics" },
  { t: "48:02", label: "Combinations" },
];

export type GateState = "approved" | "evaluating" | "config" | "blocked" | "review";
