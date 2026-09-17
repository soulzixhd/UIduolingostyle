import { useState, useMemo } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
type RiasecCode = "R" | "I" | "A" | "S" | "E" | "C";
type TestId     = "riasec" | "hidden_talent" | "visual_prefs" | "quick_reply";
type Screen     = "landing" | "intro" | "test_select" | "test" | "complete" | "results" | "career";

interface Dimension { code: RiasecCode; name: string; short: string; description: string; color: string; bg: string; }
interface Career    { id: string; title: string; field: string; codes: RiasecCode[]; summary: string; tags: string[]; why: string; involves: string[]; studies: string[]; roles: string[]; outlook: string; }
interface QuestionTheme { bg: string; s1: string; s2: string; isDark: boolean; }

interface TestQuestion {
  id: string;
  text: string;
  type: "likert" | "text" | "choice" | "quick_reply";
  dims?: string[];
  maxChars?: number;
  options?: { id: string; icon: string; label: string; scores: Partial<Record<string, number>> }[];
}

interface TestDef {
  id: TestId;
  icon: string;
  title: string;
  badge: string;
  desc: string;
  duration: string;
  color: string;
  questions: TestQuestion[];
}

// ── Dimensions ───────────────────────────────────────────────────────────────
const dimensions: Dimension[] = [
  { code: "R", name: "Realistic",     short: "Practic",    description: "Practic, tehnic, orientat spre lucruri concrete.", color: "#F97316", bg: "#FFF7ED" },
  { code: "I", name: "Investigative", short: "Analitic",   description: "Curios, analitic, atras de probleme și idei.",     color: "#3B82F6", bg: "#EFF6FF" },
  { code: "A", name: "Artistic",      short: "Creativ",    description: "Creativ, expresiv, atras de design și idei noi.",  color: "#A855F7", bg: "#FAF5FF" },
  { code: "S", name: "Social",        short: "Empatic",    description: "Orientat spre oameni, ajutor și colaborare.",      color: "#EF4444", bg: "#FFF5F5" },
  { code: "E", name: "Enterprising",  short: "Inițiativă", description: "Leadership, inițiativă, business și persuasiune.", color: "#22C55E", bg: "#F0FFF4" },
  { code: "C", name: "Conventional",  short: "Organizat",  description: "Organizare, structură, date și proceduri.",        color: "#6366F1", bg: "#EEF2FF" },
];

// ── Dimension mapping (talent dims → RIASEC) ─────────────────────────────────
const TALENT_TO_RIASEC: Record<string, RiasecCode> = {
  COM: "S", SOC: "S", EMP: "S", COL: "S", VAL: "S",
  LED: "E", INI: "E", PER: "E",
  ANA: "I", OBS: "I",
  CRE: "A", STO: "A", HUM: "A",
  PRA: "R", ADA: "R", AUT: "R", RES: "R",
  ORG: "C",
};

// ── Careers ───────────────────────────────────────────────────────────────────
const careers: Career[] = [
  {
    id: "inginerie", title: "Inginer mecanic", field: "Inginerie", codes: ["R", "I", "C"],
    summary: "O direcție potrivită dacă îți plac problemele tehnice, lucrurile concrete și găsirea unor soluții.",
    tags: ["Tehnic", "Analiză", "Practic"],
    why: "Combină gândirea logică cu lucrul practic și transformă ideile în mecanisme care funcționează.",
    involves: ["Proiectarea și testarea sistemelor", "Rezolvarea problemelor tehnice", "Lucrul cu echipe de producție"],
    studies: ["Inginerie mecanică", "Mecatronică", "Robotică"],
    roles: ["Inginer proiectant", "Inginer de testare", "Specialist mentenanță"],
    outlook: "Poți lucra în industrii foarte diferite: energie, transport, producție, robotică sau tehnologii sustenabile.",
  },
  {
    id: "arhitectura", title: "Arhitect", field: "Arhitectură", codes: ["A", "I", "R"],
    summary: "Îmbină creativitatea, precizia și dorința de a construi spații utile pentru oameni.",
    tags: ["Creativ", "Spațiu", "Tehnic"],
    why: "Îți oferă libertatea de a imagina, dar și provocarea de a face ideile realizabile și utile.",
    involves: ["Crearea conceptelor de spațiu", "Desen și modelare 3D", "Colaborarea cu ingineri și clienți"],
    studies: ["Arhitectură", "Urbanism", "Design de interior"],
    roles: ["Arhitect", "Urbanist", "Designer de interior"],
    outlook: "Domeniul evoluează spre clădiri sustenabile, orașe mai bune și instrumente digitale de proiectare.",
  },
  {
    id: "informatica", title: "Dezvoltator software", field: "Informatică", codes: ["I", "C", "R"],
    summary: "Poate fi interesantă dacă îți place să descompui problemele și să construiești soluții digitale.",
    tags: ["Logică", "Tehnologie", "Soluții"],
    why: "Îți folosește curiozitatea și logica pentru a crea produse pe care oamenii le folosesc zi de zi.",
    involves: ["Scrierea și testarea codului", "Înțelegerea nevoilor utilizatorilor", "Îmbunătățirea produselor digitale"],
    studies: ["Informatică", "Automatică și calculatoare", "Matematică-informatică"],
    roles: ["Dezvoltator web", "Inginer software", "Analist de date"],
    outlook: "Competențele digitale sunt utile în aproape orice industrie, de la educație și sănătate la divertisment.",
  },
  {
    id: "psihologie", title: "Psiholog", field: "Psihologie", codes: ["S", "I", "A"],
    summary: "O direcție de explorat dacă te interesează oamenii, comportamentul și sprijinul oferit celorlalți.",
    tags: ["Oameni", "Ascultare", "Înțelegere"],
    why: "Combină interesul pentru oameni cu dorința de a înțelege și analiza experiențele lor.",
    involves: ["Ascultare și evaluare", "Studierea comportamentului", "Sprijin adaptat fiecărei persoane"],
    studies: ["Psihologie", "Științele educației", "Asistență socială"],
    roles: ["Psiholog clinician", "Consilier școlar", "Specialist resurse umane"],
    outlook: "Nevoia de sprijin pentru sănătatea mintală, educație și bunăstare este tot mai vizibilă.",
  },
  {
    id: "design-industrial", title: "Designer de produs", field: "Design industrial", codes: ["A", "R", "I"],
    summary: "Transformă observațiile și ideile creative în obiecte și experiențe utile.",
    tags: ["Design", "Prototip", "Inovație"],
    why: "Este un amestec echilibrat între creativitate, funcționalitate și înțelegerea modului în care oamenii folosesc obiectele.",
    involves: ["Schițe și prototipuri", "Testarea ideilor", "Alegerea materialelor și formelor"],
    studies: ["Design de produs", "Design industrial", "Ingineria produsului"],
    roles: ["Designer de produs", "Designer industrial", "Specialist prototipare"],
    outlook: "Produsele sustenabile, dispozitivele inteligente și experiențele accesibile creează direcții noi.",
  },
  {
    id: "marketing", title: "Strateg de marketing", field: "Marketing", codes: ["E", "A", "S"],
    summary: "Potrivit dacă îți place să înțelegi oamenii, să comunici idei și să dai energie proiectelor.",
    tags: ["Comunicare", "Strategie", "Creativ"],
    why: "Îți permite să îmbini ideile creative cu inițiativa și cu înțelegerea publicului.",
    involves: ["Cercetarea publicului", "Crearea campaniilor", "Măsurarea rezultatelor"],
    studies: ["Marketing", "Comunicare", "Administrarea afacerilor"],
    roles: ["Strateg de brand", "Specialist marketing digital", "Cercetător de piață"],
    outlook: "Brandurile caută oameni care înțeleg atât creativitatea, cât și datele și comunitățile digitale.",
  },
];

// ── Career character avatars ──────────────────────────────────────────────────
const CAREER_CHARS: Record<string, { main: string; tool: string; speechBubble: string }> = {
  inginerie:           { main: "👷",  tool: "⚙️",  speechBubble: "Construiesc lumea!" },
  arhitectura:         { main: "🧑‍💼", tool: "📐",  speechBubble: "Proiectez spații!" },
  informatica:         { main: "👨‍💻", tool: "💻",  speechBubble: "Scriu cod!" },
  psihologie:          { main: "🧑‍⚕️", tool: "💭",  speechBubble: "Ajut oameni!" },
  "design-industrial": { main: "👩‍🎨", tool: "🖌️",  speechBubble: "Creez produse!" },
  marketing:           { main: "🧑‍💼", tool: "📊",  speechBubble: "Spun povești!" },
};

// ── RIASEC questions ──────────────────────────────────────────────────────────
const RIASEC_PROMPTS: Record<RiasecCode, string[]> = {
  R: ["Îmi place să repar lucruri mecanice sau electronice.", "Mă atrag activitățile practice, în care construiesc ceva.", "Aș prefera să lucrez cu unelte sau echipamente.", "Îmi place să văd un rezultat concret al muncii mele.", "Mă simt bine când rezolv o problemă practică.", "Mi-ar plăcea să lucrez uneori în aer liber sau pe teren."],
  I: ["Îmi place să aflu de ce și cum funcționează lucrurile.", "Mă atrag problemele care cer logică și răbdare.", "Îmi place să caut informații înainte să trag o concluzie.", "Experimentele și descoperirile îmi stârnesc curiozitatea.", "Mă bucur când găsesc o explicație bună pentru ceva complicat.", "Aș lucra cu plăcere la o întrebare fără răspuns evident."],
  A: ["Îmi place să găsesc soluții originale, chiar dacă sunt neobișnuite.", "Mă atrag desenul, muzica, scrisul sau designul.", "Îmi place să îmi exprim ideile într-un mod personal.", "Observ detalii de culoare, formă sau stil.", "Prefer proiectele în care am libertate de creație.", "Îmi place să imaginez cum ar putea arăta ceva nou."],
  S: ["Îmi place să îi ajut pe ceilalți să înțeleagă ceva.", "Mă simt bine când lucrez împreună cu alți oameni.", "Prietenii apelează uneori la mine când au nevoie să vorbească.", "Mi-ar plăcea să contribui la binele unei comunități.", "Am răbdare să ascult puncte de vedere diferite.", "Mă motivează să văd că munca mea ajută pe cineva."],
  E: ["Îmi place să pornesc proiecte și să îi mobilizez pe ceilalți.", "Mă simt confortabil să îmi susțin ideile în fața unui grup.", "Mă atrag negocierile și găsirea unei soluții bune pentru toți.", "Îmi place să iau inițiativa când ceva trebuie organizat.", "Mă interesează cum cresc ideile în proiecte sau afaceri.", "Aș coordona cu plăcere o echipă pentru un scop comun."],
  C: ["Îmi place să pun informațiile într-o ordine clară.", "Mă simt bine când am un plan și pași concreți.", "Observ repede când lipsesc detalii importante.", "Îmi place să lucrez cu date, tabele sau liste.", "Prefer sarcinile în care știu ce rezultat este așteptat.", "Îmi place să fac un sistem mai simplu și mai eficient."],
};

const RIASEC_ORDER: RiasecCode[] = ["R", "I", "A", "S", "E", "C"];
const riasecQuestions: TestQuestion[] = Array.from({ length: 6 }, (_, round) =>
  RIASEC_ORDER.map((dim) => ({
    id: `R-${dim}-${round}`,
    text: RIASEC_PROMPTS[dim][round] ?? "",
    type: "likert" as const,
    dims: [dim],
  }))
).flat().map((q, i) => ({ ...q, id: `riasec-${i + 1}` }));

// ── Test catalog ──────────────────────────────────────────────────────────────
const TEST_CATALOG: TestDef[] = [
  {
    id: "riasec",
    icon: "🧭",
    title: "Profilul tău de interese",
    badge: "RIASEC · Clasic",
    desc: "Descoperă tipul tău de personalitate profesională și domeniile care ți se potrivesc cel mai bine.",
    duration: "10–15 min · 36 întrebări",
    color: "#58CC02",
    questions: riasecQuestions,
  },
  {
    id: "hidden_talent",
    icon: "💡",
    title: "Talentul pe care nu știai că îl ai",
    badge: "Răspunsuri libere",
    desc: "Răspunde la 5 provocări și descoperă competențele tale naturale prin răspunsuri spontane.",
    duration: "5–8 min · 5 întrebări",
    color: "#A855F7",
    questions: [
      { id: "HT01", text: "Ai 30 de secunde să convingi o sală întreagă să te asculte. Cu ce propoziție începi?", type: "text", dims: ["COM", "PER", "SOC"] },
      { id: "HT02", text: "Primești 1.000 € și 24 de ore să îi transformi în cât mai mulți bani. Ce faci?", type: "text", dims: ["INI", "PRA", "ANA", "CRE"] },
      { id: "HT04", text: "Trebuie să organizezi un eveniment pentru 100 de persoane. Care este primul lucru pe care îl faci?", type: "text", dims: ["ORG", "LED", "PRA"] },
      { id: "HT08", text: "Dacă ai avea un canal urmărit de un milion de persoane, despre ce ai vorbi?", type: "text", dims: ["STO", "CRE", "VAL", "SOC"] },
      { id: "HT10", text: "Ai o problemă pe care nimeni din grup nu știe să o rezolve. Ce faci?", type: "text", dims: ["ANA", "RES", "INI", "COL"] },
    ],
  },
  {
    id: "visual_prefs",
    icon: "🎨",
    title: "Alege imaginea care te reprezintă",
    badge: "Preferințe vizuale",
    desc: "Alege instinctiv dintre 4 variante și descoperă ce îți spun alegerile despre stilul tău profesional.",
    duration: "4–6 min · 5 întrebări",
    color: "#3B82F6",
    questions: [
      {
        id: "VP01", text: "În ce spațiu ai lucra cu plăcere?", type: "choice",
        options: [
          { id: "A", icon: "🎨", label: "Studio creativ colorat",          scores: { CRE: 3, SOC: 1 } },
          { id: "B", icon: "🏢", label: "Birou de companie cu echipă",      scores: { COL: 2, LED: 1, ORG: 1 } },
          { id: "C", icon: "🖥️", label: "Birou individual minimalist",      scores: { AUT: 3, ORG: 1 } },
          { id: "D", icon: "🌿", label: "Spațiu de lucru în aer liber",     scores: { ADA: 2, AUT: 1, CRE: 1 } },
        ],
      },
      {
        id: "VP02", text: "Ce obiect ai alege instinctiv?", type: "choice",
        options: [
          { id: "A", icon: "🎤", label: "Microfon",                        scores: { COM: 2, SOC: 2 } },
          { id: "B", icon: "💻", label: "Laptop cu grafice",                scores: { ANA: 3, ORG: 1 } },
          { id: "C", icon: "📷", label: "Aparat foto",                      scores: { CRE: 2, OBS: 2 } as any },
          { id: "D", icon: "📓", label: "Carnețel cu schițe",               scores: { STO: 2, CRE: 1, AUT: 1 } },
        ],
      },
      {
        id: "VP03", text: "Ce scenă te atrage cel mai mult?", type: "choice",
        options: [
          { id: "A", icon: "🎭", label: "Scenă cu public",                  scores: { SOC: 3, COM: 1 } },
          { id: "B", icon: "🔬", label: "Laborator modern",                 scores: { ANA: 2, OBS: 2 } as any },
          { id: "C", icon: "📋", label: "Ședință de strategie",             scores: { LED: 2, ORG: 1, COL: 1 } },
          { id: "D", icon: "🛠️", label: "Atelier de creație",              scores: { CRE: 3, PRA: 1 } },
        ],
      },
      {
        id: "VP06", text: "Ce rol te atrage într-un grup?", type: "choice",
        options: [
          { id: "A", icon: "🗣️", label: "Persoana care vorbește",          scores: { COM: 2, SOC: 2 } },
          { id: "B", icon: "👂", label: "Persoana care ascultă",            scores: { EMP: 3, OBS: 1 } as any },
          { id: "C", icon: "📅", label: "Persoana care organizează",        scores: { ORG: 2, LED: 2 } },
          { id: "D", icon: "😄", label: "Persoana care face lumea să râdă", scores: { HUM: 3, ADA: 1 } as any },
        ],
      },
      {
        id: "VP08", text: "Ce activitate ai alege?", type: "choice",
        options: [
          { id: "A", icon: "🎤", label: "Susținerea unei prezentări",       scores: { COM: 2, SOC: 2 } },
          { id: "B", icon: "🔨", label: "Construirea unui obiect",          scores: { PRA: 3, ANA: 1 } },
          { id: "C", icon: "🤝", label: "Negocierea unui acord",            scores: { PER: 3, COM: 1 } },
          { id: "D", icon: "🎨", label: "Crearea unei identități vizuale",  scores: { CRE: 3, OBS: 1 } as any },
        ],
      },
    ],
  },
  {
    id: "quick_reply",
    icon: "⚡",
    title: "Testul de replică",
    badge: "Spontaneitate · 300 caractere",
    desc: "Completează 5 propoziții neterminate. Primul răspuns care îți vine în minte este de obicei cel mai bun.",
    duration: "3–5 min · 5 replici",
    color: "#F97316",
    questions: [
      { id: "QR01", text: "Am întârziat pentru că...", type: "quick_reply", maxChars: 300, dims: ["HUM", "CRE", "ADA"] },
      { id: "QR02", text: "Dacă viața mea ar fi un serial, episodul de azi s-ar numi...", type: "quick_reply", maxChars: 300, dims: ["STO", "HUM", "CRE"] },
      { id: "QR05", text: "Un extraterestru mă întreabă ce este TikTok. Îi spun...", type: "quick_reply", maxChars: 300, dims: ["COM", "CRE", "HUM"] },
      { id: "QR07", text: "Am 15 secunde la televizor. Spun...", type: "quick_reply", maxChars: 300, dims: ["COM", "SOC", "VAL"] },
      { id: "QR09", text: "Cea mai bună reclamă pentru mine ar suna așa...", type: "quick_reply", maxChars: 300, dims: ["PER", "AUT", "STO"] },
    ],
  },
];

const ANSWER_LABELS = ["Dezacord total", "Mai degrabă nu", "Neutru", "Mai degrabă da", "Acord total"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function getQuestionTheme(index: number, total: number): QuestionTheme {
  const t = index / Math.max(total - 1, 1);
  const hue = 250 + t * 140;
  const bgL  = 12 + t * 72;
  const bgS  = 65 + t * 5;
  return {
    bg: `hsl(${hue}, ${bgS}%, ${bgL}%)`,
    s1: `hsla(${hue - 18}, 80%, ${Math.min(bgL + 14, 94)}%, 0.38)`,
    s2: `hsla(${hue + 22}, 70%, ${Math.min(bgL + 26, 97)}%, 0.26)`,
    isDark: bgL < 50,
  };
}

// Score a completed test into RIASEC codes
function scoreTest(
  testId: TestId,
  questions: TestQuestion[],
  answers: Record<string, string | number>
): Record<RiasecCode, number> {
  const base = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 } as Record<RiasecCode, number>;

  if (testId === "riasec") {
    questions.forEach((q) => {
      const ans = answers[q.id];
      if (typeof ans === "number" && q.dims) {
        const code = q.dims[0] as RiasecCode;
        if (code && base[code] !== undefined) base[code] += ans;
      }
    });
    // Normalize RIASEC so each dimension accumulates 6-30
    RIASEC_ORDER.forEach((c) => { if (base[c] === 0) base[c] = 6; });
    return base;
  }

  if (testId === "visual_prefs") {
    questions.forEach((q) => {
      const chosen = answers[q.id] as string;
      const opt = q.options?.find((o) => o.id === chosen);
      if (opt) {
        Object.entries(opt.scores).forEach(([dim, pts]) => {
          const rc = TALENT_TO_RIASEC[dim];
          if (rc) base[rc] += pts as number;
        });
      }
    });
    // Normalize to RIASEC scale
    const max = Math.max(...Object.values(base));
    if (max > 0) {
      RIASEC_ORDER.forEach((c) => { base[c] = Math.round(6 + (base[c] / max) * 24); });
    } else {
      RIASEC_ORDER.forEach((c) => { base[c] = 6; });
    }
    return base;
  }

  // text + quick_reply: each answered question adds fixed points per dimension
  questions.forEach((q) => {
    const ans = answers[q.id];
    if (typeof ans === "string" && ans.trim().length > 5 && q.dims) {
      q.dims.forEach((dim) => {
        const rc = TALENT_TO_RIASEC[dim];
        if (rc) base[rc] += 2;
      });
    }
  });
  // Normalize
  const max = Math.max(...Object.values(base));
  if (max > 0) {
    RIASEC_ORDER.forEach((c) => { base[c] = Math.round(6 + (base[c] / max) * 24); });
  } else {
    RIASEC_ORDER.forEach((c) => { base[c] = 6; });
  }
  return base;
}

// ── Background shapes ─────────────────────────────────────────────────────────
function Shapes({ s1, s2, variant }: { s1: string; s2: string; variant: number }) {
  const v = variant % 4;
  if (v === 0) return (
    <>
      <div style={{ position: "absolute", top: "-70px", right: "-60px", width: "320px", height: "320px", background: s1, borderRadius: "67% 33% 58% 42% / 43% 55% 45% 57%" }} />
      <div style={{ position: "absolute", bottom: "50px", left: "-50px", width: "200px", height: "200px", background: s2, borderRadius: "42% 58% 70% 30% / 60% 40% 60% 40%" }} />
      <div style={{ position: "absolute", top: "42%", left: "6%", width: "90px", height: "90px", background: s1, borderRadius: "50%" }} />
    </>
  );
  if (v === 1) return (
    <>
      <div style={{ position: "absolute", top: "-55px", left: "12%", width: "260px", height: "260px", background: s2, borderRadius: "30% 70% 40% 60% / 50% 30% 70% 50%" }} />
      <div style={{ position: "absolute", bottom: "-50px", right: "-40px", width: "220px", height: "220px", background: s1, borderRadius: "70% 30% 50% 50% / 30% 60% 40% 70%" }} />
      <div style={{ position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)", width: "110px", height: "280px", background: s2, borderRadius: "50% 50% 0 0 / 80% 80% 0 0" }} />
    </>
  );
  if (v === 2) return (
    <>
      <div style={{ position: "absolute", top: "50px", right: "-55px", width: "290px", height: "190px", background: s1, borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%" }} />
      <div style={{ position: "absolute", top: "-35px", left: "-35px", width: "170px", height: "170px", background: s2, borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "-80px", left: "18%", width: "270px", height: "270px", background: s1, borderRadius: "60% 40% 30% 70% / 50% 60% 40% 50%" }} />
    </>
  );
  return (
    <>
      <div style={{ position: "absolute", bottom: "-65px", right: "-80px", width: "360px", height: "260px", background: s2, borderRadius: "70% 30% 60% 40% / 40% 60% 40% 60%" }} />
      <div style={{ position: "absolute", top: "20%", left: "-25px", width: "150px", height: "150px", background: s1, borderRadius: "40% 60% 70% 30% / 50% 40% 60% 50%" }} />
      <div style={{ position: "absolute", top: "8%", right: "18%", width: "85px", height: "85px", background: s2, borderRadius: "50%" }} />
    </>
  );
}

// ── Reusable button ───────────────────────────────────────────────────────────
type BtnVariant = "primary" | "outline" | "ghost";
type BtnSize    = "sm" | "md" | "lg";

function Btn({ children, onClick, disabled = false, variant = "primary", size = "md", className = "" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean;
  variant?: BtnVariant; size?: BtnSize; className?: string;
}) {
  const base = "inline-flex items-center justify-center gap-2 font-extrabold rounded-2xl transition-all duration-75 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0";
  const sizes: Record<BtnSize, string> = { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-base", lg: "px-8 py-4 text-lg" };
  const variants: Record<BtnVariant, string> = {
    primary: "bg-[#58CC02] text-white shadow-[0_4px_0_#46A302] hover:shadow-[0_2px_0_#46A302] hover:translate-y-0.5 active:shadow-none active:translate-y-1",
    outline:  "bg-white text-[#58CC02] border-2 border-[#58CC02] shadow-[0_4px_0_#b8e888] hover:shadow-[0_2px_0_#b8e888] hover:translate-y-0.5 active:shadow-none active:translate-y-1",
    ghost:    "bg-transparent text-[#777] hover:bg-[#f7f7f7] hover:text-[#3c3c3c]",
  };
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function Logo({ onClick, light = false }: { onClick?: () => void; light?: boolean }) {
  return (
    <button onClick={onClick} className={cn("flex items-center gap-2.5 font-black text-xl hover:opacity-80 transition-opacity", light ? "text-white" : "text-[#3c3c3c]")}>
      <div className="w-10 h-10 bg-[#58CC02] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-[0_3px_0_#46A302]">M</div>
      <span className="hidden sm:block">Mai departe</span>
    </button>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-bold px-2.5 py-1 bg-[#f7f7f7] text-[#777] rounded-lg border border-[#e5e5e5]">{children}</span>;
}

// ── How It Works Modal ────────────────────────────────────────────────────────
const HOW_STEPS = [
  { n: "01", icon: "✏️", color: "#3B82F6", bg: "#EFF6FF", title: "Răspunde la întrebări", desc: "Completează chestionarul ales prin răspunsuri sincere." },
  { n: "02", icon: "🔍", color: "#A855F7", bg: "#FAF5FF", title: "Descoperă-ți profilul",  desc: "Vei primi un profil care îți descrie cel mai bine stilul personal." },
  { n: "03", icon: "🗺️", color: "#22C55E", bg: "#F0FFF4", title: "Explorează posibilitățile", desc: "Vei vedea domenii și cariere care ți se potrivesc și te pot inspira." },
];

function HowItWorksModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-modal-overlay" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-7 sm:p-10 animate-modal-card overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-[#f7f7f7] text-[#777] hover:bg-[#e5e5e5] hover:text-[#3c3c3c] font-black text-base transition-colors">✕</button>
        <div className="text-3xl mb-3">🧭</div>
        <h2 className="text-2xl font-black text-[#3c3c3c]">Cum funcționează?</h2>
        <p className="mt-1 text-sm text-[#777] font-bold">Trei pași spre mai multă claritate</p>
        <div className="mt-7 space-y-4">
          {HOW_STEPS.map(({ n, icon, color, bg, title, desc }) => (
            <div key={n} className="flex gap-4 items-start rounded-2xl p-4 border-2" style={{ borderColor: color + "33", backgroundColor: bg }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: color + "20", border: `2px solid ${color}40` }}>{icon}</div>
              <div>
                <div className="text-xs font-black mb-0.5" style={{ color }}>{n}</div>
                <h3 className="font-black text-[#3c3c3c] text-base leading-tight">{title}</h3>
                <p className="mt-1 text-sm text-[#777] font-semibold leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Btn onClick={onClose} size="lg" className="w-full mt-7">Am înțeles 👍</Btn>
      </div>
    </div>
  );
}

// ── Career Character Card (with interactive hover) ─────────────────────────────
function CareerCharacterCard({ career, onOpen }: { career: Career; onOpen: () => void }) {
  const char  = CAREER_CHARS[career.id] ?? { main: "👤", tool: "⭐", speechBubble: "Explorează!" };
  const dim   = dimensions.find((d) => d.code === career.codes[0])!;

  return (
    <div
      onClick={onOpen}
      className="group bg-white rounded-3xl border-2 border-[#E5E5E5] p-6 flex flex-col items-center text-center cursor-pointer
                 transition-all duration-200 ease-out
                 hover:border-[#58CC02] hover:shadow-2xl hover:shadow-green-100
                 hover:-translate-y-2 hover:scale-[1.04]"
    >
      {/* Character bubble */}
      <div className="relative mb-1">
        {/* Speech bubble - hidden, appears on hover */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                        bg-[#3c3c3c] text-white text-xs font-extrabold px-3 py-1.5 rounded-xl
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
             style={{ boxShadow: "0 2px 0 rgba(0,0,0,0.25)" }}>
          {char.speechBubble}
          <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-0"
               style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "6px solid #3c3c3c" }} />
        </div>

        {/* Avatar circle */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-5xl
                     transition-all duration-200 group-hover:scale-110"
          style={{ backgroundColor: dim.bg }}
        >
          {char.main}
        </div>

        {/* Tool badge */}
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-[#E5E5E5]
                        flex items-center justify-center text-base shadow-sm
                        transition-all duration-200 group-hover:scale-110 group-hover:border-[#58CC02]">
          {char.tool}
        </div>
      </div>

      <div className="mt-4 text-xs font-black text-[#afafaf] uppercase tracking-wider">{career.field}</div>
      <h3 className="mt-1 text-lg font-black text-[#3c3c3c] leading-tight">{career.title}</h3>
      <p className="mt-2 text-xs text-[#777] font-semibold leading-relaxed flex-1">{career.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
        {career.tags.map((t) => <Tag key={t}>{t}</Tag>)}
      </div>
      <div className="mt-4 text-sm font-extrabold text-[#58CC02] group-hover:underline transition-all">
        Explorează →
      </div>
    </div>
  );
}

// ── LANDING ───────────────────────────────────────────────────────────────────
function Landing({ onStart }: { onStart: () => void }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Logo />
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => setShowModal(true)} className="text-sm font-bold text-[#777] hover:text-[#3c3c3c] transition-colors">Cum funcționează</button>
          <a href="#despre-test" className="text-sm font-bold text-[#777] hover:text-[#3c3c3c] transition-colors">Despre test</a>
        </nav>
        <Btn onClick={onStart} size="md">Alege testul →</Btn>
      </header>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pt-8 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#FFF7ED] text-[#EA580C] font-extrabold text-xs px-3 py-1.5 rounded-full border border-[#FED7AA] mb-6">
            🎯 Orientare în ritmul tău
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-[#3c3c3c] leading-[1.1] tracking-tight">
            Nu știi încă ce vrei<br />să faci{" "}
            <span className="text-[#58CC02]">mai departe?</span>
          </h1>
          <p className="mt-5 text-lg text-[#777] leading-relaxed max-w-lg font-semibold">
            Descoperă ce domenii și cariere s-ar putea potrivi cu interesele tale. Alege din 4 teste diferite.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Btn onClick={onStart} size="lg">🚀 Alege testul</Btn>
            <Btn variant="outline" size="lg" onClick={() => setShowModal(true)}>Cum funcționează?</Btn>
          </div>
          <p className="mt-4 text-sm text-[#afafaf] font-bold">⏱️ 3–15 minute · fără cont necesar</p>
        </div>
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-[#58CC02] rounded-2xl shadow-[0_5px_0_#46A302] flex items-center justify-center text-3xl z-10">🧭</div>
            </div>
            {[
              { label: "🔧 Tehnic",   pos: "top-0 left-1/2 -translate-x-1/2", c: "#F97316", bg: "#FFF7ED" },
              { label: "💡 Idei",     pos: "top-1/2 right-0 -translate-y-1/2", c: "#3B82F6", bg: "#EFF6FF" },
              { label: "🎨 Design",   pos: "bottom-2 right-4",                 c: "#A855F7", bg: "#FAF5FF" },
              { label: "🤝 Oameni",   pos: "bottom-2 left-4",                  c: "#EF4444", bg: "#FFF5F5" },
              { label: "📈 Business", pos: "top-1/2 left-0 -translate-y-1/2",  c: "#22C55E", bg: "#F0FFF4" },
            ].map(({ label, pos, c, bg }) => (
              <div key={label} className={`absolute ${pos} px-3 py-2 rounded-xl font-extrabold text-xs border-2`} style={{ backgroundColor: bg, borderColor: c, color: c }}>{label}</div>
            ))}
          </div>
        </div>
      </section>

      <section id="cum-functioneaza" className="bg-[#F7F7F7] border-y-2 border-[#E5E5E5] py-20 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">Simplu, de la prima întrebare</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-[#3c3c3c]">Trei pași spre mai multă claritate</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {[{ num: "01", icon: "✏️", title: "Răspunzi", desc: "Ne spui ce îți place și ce te interesează." }, { num: "02", icon: "🔍", title: "Descoperi", desc: "Îți conturăm profilul de interese." }, { num: "03", icon: "🗺️", title: "Explorezi", desc: "Vezi domenii și cariere care s-ar putea potrivi." }].map(({ num, icon, title, desc }) => (
              <div key={num} className="bg-white rounded-3xl p-8 border-2 border-[#E5E5E5] text-left">
                <div className="text-4xl mb-4">{icon}</div>
                <div className="text-[#afafaf] font-black text-xs mb-1">{num}</div>
                <h3 className="text-xl font-black text-[#3c3c3c]">{title}</h3>
                <p className="mt-2 text-sm text-[#777] leading-relaxed font-semibold">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="despre-test" className="max-w-3xl mx-auto px-5 py-20 text-center">
        <div className="text-5xl mb-5">✅</div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#3c3c3c]">Nu există răspunsuri corecte sau greșite.</h2>
        <p className="mt-4 text-lg text-[#777] leading-relaxed max-w-xl mx-auto font-semibold">
          Alege ce te reprezintă acum. Rezultatul nu te pune într-o cutie — îți arată câteva direcții pe care merită să le explorezi.
        </p>
        <Btn onClick={onStart} size="lg" className="mt-8">Sunt gata să descopăr 🌟</Btn>
      </section>

      <footer className="border-t-2 border-[#E5E5E5] px-5 py-8 text-center text-sm text-[#afafaf] font-bold">
        Mai departe · Un punct bun de pornire.
      </footer>

      {showModal && <HowItWorksModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

// ── TEST SELECTOR ─────────────────────────────────────────────────────────────
function TestSelector({ onSelect, onBack }: { onSelect: (id: TestId) => void; onBack: () => void }) {
  const colorMap: Record<TestId, string> = {
    riasec: "#58CC02", hidden_talent: "#A855F7", visual_prefs: "#3B82F6", quick_reply: "#F97316",
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between px-5 py-5 sm:px-8">
        <Logo onClick={onBack} />
        <Btn variant="ghost" onClick={onBack} size="sm">← Înapoi</Btn>
      </header>

      <section className="flex-1 max-w-5xl mx-auto w-full px-5 sm:px-8 py-10 animate-slide-up">
        <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">Fiecare test explorează o altă față a ta</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-black text-[#3c3c3c]">Alege testul tău</h1>
        <p className="mt-2 text-[#777] font-semibold">Nu există o ordine obligatorie. Poți reveni oricând să încerci altul.</p>

        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          {TEST_CATALOG.map((test) => {
            const c = colorMap[test.id];
            return (
              <button
                key={test.id}
                onClick={() => onSelect(test.id)}
                className="group text-left bg-white rounded-3xl border-2 border-[#E5E5E5] p-7 transition-all duration-200
                           hover:shadow-xl hover:-translate-y-1 hover:border-[color] active:scale-[0.99]"
                style={{ "--hover-border": c } as React.CSSProperties}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = c)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-110"
                       style={{ backgroundColor: c + "18", border: `2px solid ${c}30` }}>
                    {test.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: c }}>{test.badge}</div>
                    <h3 className="text-lg font-black text-[#3c3c3c] leading-tight">{test.title}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm text-[#777] font-semibold leading-relaxed">{test.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#afafaf]">⏱️ {test.duration}</span>
                  <span className="text-sm font-extrabold transition-colors" style={{ color: c }}>Începe →</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ── INTRO ─────────────────────────────────────────────────────────────────────
function Intro({ testDef, onStart, onBack }: { testDef: TestDef; onStart: () => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between px-5 py-5 sm:px-8">
        <Logo onClick={onBack} />
        <Btn variant="ghost" onClick={onBack} size="sm">← Înapoi</Btn>
      </header>
      <section className="flex-1 flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="max-w-lg w-full text-center animate-slide-up">
          <div className="text-6xl mb-4">{testDef.icon}</div>
          <div className="inline-block text-xs font-extrabold px-3 py-1 rounded-full border mb-4" style={{ color: testDef.color, backgroundColor: testDef.color + "15", borderColor: testDef.color + "40" }}>
            {testDef.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#3c3c3c] leading-tight">{testDef.title}</h1>
          <p className="mt-5 text-base text-[#777] leading-relaxed font-semibold max-w-sm mx-auto">{testDef.desc}</p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { val: String(testDef.questions.length), label: "întrebări" },
              { val: testDef.duration.split("·")[0].trim(), label: "timp estimat" },
              { val: "✓", label: "fără răspunsuri corecte" },
            ].map(({ val, label }) => (
              <div key={label} className="bg-[#F7F7F7] rounded-2xl p-4 border-2 border-[#E5E5E5]">
                <div className="text-xl font-black text-[#3c3c3c]">{val}</div>
                <div className="text-xs text-[#777] font-bold mt-1 leading-tight">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFF7ED] border-2 border-[#FED7AA] rounded-2xl px-5 py-4 text-sm text-[#C2410C] font-bold text-left flex gap-3 items-start">
            <span className="text-base shrink-0">💬</span>
            <span>Răspunde cât mai sincer. Rezultatul este un punct de plecare, nu o etichetă.</span>
          </div>
          <Btn onClick={onStart} size="lg" className="mt-8 w-full" style={{ backgroundColor: testDef.color, boxShadow: `0 4px 0 ${testDef.color}88` } as React.CSSProperties}>
            Începe testul 🚀
          </Btn>
        </div>
      </section>
    </div>
  );
}

// ── TEST ──────────────────────────────────────────────────────────────────────
function Test({ testDef, answers, current, onAnswer, onNext, onBack }: {
  testDef: TestDef;
  answers: Record<string, string | number>;
  current: number;
  onAnswer: (val: string | number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [inputVal, setInputVal] = useState("");

  const question  = testDef.questions[current];
  if (!question) return null;

  const currentAns = answers[question.id];
  const isAnswered = question.type === "likert"
    ? typeof currentAns === "number"
    : question.type === "choice"
    ? typeof currentAns === "string" && currentAns.length > 0
    : typeof currentAns === "string" ? currentAns.trim().length > 0 : inputVal.trim().length > 0;

  const progress  = ((current + 1) / testDef.questions.length) * 100;
  const isLast    = current === testDef.questions.length - 1;
  const theme     = getQuestionTheme(current, testDef.questions.length);
  const variant   = current % 4;

  const handleNext = () => {
    if (question.type !== "likert" && question.type !== "choice") {
      // commit text input
      if (inputVal.trim()) onAnswer(inputVal.trim());
    }
    setDirection("forward");
    setInputVal("");
    onNext();
  };

  const handleBack = () => {
    setDirection("back");
    setInputVal("");
    onBack();
  };

  // Pre-fill text input from saved answer when navigating back
  const savedText = typeof currentAns === "string" ? currentAns : "";

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden"
         style={{ backgroundColor: theme.bg, transition: "background-color 700ms ease" }}>
      <div key={`shapes-${current}`} className="absolute inset-0 pointer-events-none overflow-hidden animate-shapes-enter">
        <Shapes s1={theme.s1} s2={theme.s2} variant={variant} />
      </div>

      {/* Progress */}
      <div className="relative z-10 px-4 pt-5 pb-3 sm:px-6">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center rounded-full font-black text-sm transition-all shrink-0"
            style={{ background: "rgba(255,255,255,0.2)", color: theme.isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.5)" }}>
            ✕
          </button>
          <div className="flex-1 h-3.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.25)" }}>
            <div className="h-full rounded-full transition-all duration-500 ease-out"
                 style={{ width: `${progress}%`, background: theme.isDark ? "rgba(255,255,255,0.9)" : testDef.color }} />
          </div>
          <span className="text-sm font-black shrink-0 min-w-[3rem] text-right"
                style={{ color: theme.isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.55)" }}>
            {current + 1}/{testDef.questions.length}
          </span>
        </div>
      </div>

      {/* Card */}
      <div className="relative z-10 flex-1 px-4 pb-6 pt-4 sm:px-6 flex items-start sm:items-center justify-center">
        <div key={`card-${current}`}
             className={cn("w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8", direction === "forward" ? "animate-card-right" : "animate-card-left")}>

          <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest mb-4">
            {question.type === "likert"     ? "Alege varianta care te reprezintă"
             : question.type === "choice"   ? "Alege una dintre variante"
             : question.type === "quick_reply" ? "Completează propoziția"
             : "Nu există un răspuns perfect — scrie primul gând"}
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-[#3c3c3c] leading-snug mb-6">{question.text}</h1>

          {/* LIKERT */}
          {question.type === "likert" && (
            <fieldset className="space-y-2.5">
              <legend className="sr-only">Selectează un răspuns</legend>
              {ANSWER_LABELS.map((label, index) => {
                const value = index + 1;
                const isSel = currentAns === value;
                return (
                  <button key={label} type="button" aria-pressed={isSel}
                    onClick={() => onAnswer(value)}
                    className={cn("w-full flex items-center gap-3.5 p-3.5 rounded-2xl border-2 text-left transition-all duration-150 cursor-pointer",
                      isSel ? "border-[#58CC02] bg-[#F0FFF4] shadow-[0_2px_0_#b8f5b8]" : "border-[#E5E5E5] bg-white hover:border-[#93C5FD] hover:bg-[#EFF6FF]")}>
                    <span className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 transition-all",
                      isSel ? "bg-[#58CC02] text-white shadow-[0_2px_0_#46A302]" : "bg-[#F7F7F7] text-[#afafaf] border-2 border-[#E5E5E5]")}>
                      {isSel ? "✓" : value}
                    </span>
                    <span className={cn("flex-1 font-extrabold text-sm", isSel ? "text-[#166534]" : "text-[#3c3c3c]")}>{label}</span>
                    {isSel && <span className="text-[#58CC02] font-black text-base shrink-0">●</span>}
                  </button>
                );
              })}
            </fieldset>
          )}

          {/* CHOICE (visual prefs) */}
          {question.type === "choice" && (
            <div className="grid grid-cols-2 gap-3">
              {question.options?.map((opt) => {
                const isSel = currentAns === opt.id;
                return (
                  <button key={opt.id} type="button" aria-pressed={isSel}
                    onClick={() => onAnswer(opt.id)}
                    className={cn("flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all duration-150 cursor-pointer",
                      isSel ? "border-[#3B82F6] bg-[#EFF6FF] shadow-[0_2px_0_#bfdbfe]" : "border-[#E5E5E5] bg-white hover:border-[#93C5FD] hover:bg-[#F8FAFF]")}>
                    <span className={cn("text-4xl transition-transform duration-150", isSel ? "scale-110" : "")}>{opt.icon}</span>
                    <span className={cn("text-sm font-extrabold leading-tight", isSel ? "text-[#1D4ED8]" : "text-[#3c3c3c]")}>{opt.label}</span>
                    {isSel && <span className="w-5 h-5 bg-[#3B82F6] rounded-full flex items-center justify-center text-white text-xs font-black">✓</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* TEXT (hidden talent, situational, etc.) */}
          {question.type === "text" && (
            <textarea
              className="w-full min-h-[120px] rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F7F7] p-4 text-sm font-semibold text-[#3c3c3c] resize-none outline-none focus:border-[#A855F7] focus:bg-white transition-all placeholder:text-[#afafaf]"
              placeholder="Scrie răspunsul tău aici..."
              defaultValue={savedText}
              onChange={(e) => onAnswer(e.target.value)}
            />
          )}

          {/* QUICK REPLY */}
          {question.type === "quick_reply" && (
            <div>
              <textarea
                className="w-full min-h-[90px] rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F7F7] p-4 text-sm font-semibold text-[#3c3c3c] resize-none outline-none focus:border-[#F97316] focus:bg-white transition-all placeholder:text-[#afafaf]"
                placeholder="Completează propoziția..."
                maxLength={question.maxChars}
                defaultValue={savedText}
                onChange={(e) => onAnswer(e.target.value)}
              />
              <div className="mt-1 text-right text-xs text-[#afafaf] font-bold">
                {typeof currentAns === "string" ? currentAns.length : 0}/{question.maxChars ?? 300} caractere
              </div>
            </div>
          )}

          <div className="mt-6 space-y-2">
            <Btn onClick={handleNext} disabled={!isAnswered} size="lg" className="w-full"
                 style={isAnswered ? { backgroundColor: testDef.color, boxShadow: `0 4px 0 ${testDef.color}88` } as React.CSSProperties : undefined}>
              {isLast ? "🎯 Vezi rezultatul" : "Continuă →"}
            </Btn>
            {!isAnswered && <p className="text-center text-xs text-[#afafaf] font-bold">Completează câmpul pentru a continua.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── COMPLETION ─────────────────────────────────────────────────────────────────
function Completion({ onShow }: { onShow: () => void }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5 py-12">
      <div className="max-w-md w-full text-center animate-bounce-in">
        <div className="text-8xl mb-6">🎉</div>
        <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">Ai terminat!</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-black text-[#3c3c3c]">Profilul tău e gata.</h1>
        <p className="mt-5 text-base text-[#777] leading-relaxed font-semibold max-w-sm mx-auto">
          Am pus cap la cap răspunsurile tale. Urmează câteva direcții de explorat.
        </p>
        <div className="mt-8 bg-[#F0FFF4] border-2 border-[#BBF7D0] rounded-2xl p-6">
          <div className="text-3xl mb-2">🌱</div>
          <p className="font-extrabold text-[#166534] text-sm">Acesta este un punct de plecare. Explorarea ta continuă de aici.</p>
        </div>
        <Btn onClick={onShow} size="lg" className="mt-8 w-full">🗺️ Vezi profilul meu</Btn>
      </div>
    </div>
  );
}

// ── RESULTS ───────────────────────────────────────────────────────────────────
function Results({ testDef, scores, answers, onCareer, onRetake }: {
  testDef: TestDef;
  scores: Record<RiasecCode, number>;
  answers: Record<string, string | number>;
  onCareer: (c: Career) => void;
  onRetake: () => void;
}) {
  const top = useMemo(
    () => [...dimensions].sort((a, b) => scores[b.code] - scores[a.code]).slice(0, 3).map((d) => d.code),
    [scores]
  );
  const code = top.join("");
  const recommended = useMemo(
    () => [...careers]
      .sort((a, b) =>
        b.codes.reduce((t, c, i) => t + (top.includes(c) ? 3 - i : 0), 0) -
        a.codes.reduce((t, c, i) => t + (top.includes(c) ? 3 - i : 0), 0)
      ).slice(0, 3),
    [top]
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-2 border-[#E5E5E5] px-5 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo />
          <Btn variant="outline" onClick={onRetake} size="sm">🔄 Încearcă alt test</Btn>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b-2 border-[#BBF7D0] px-5 py-16 sm:py-20" style={{ backgroundColor: testDef.color + "18" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{testDef.icon}</span>
            <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">{testDef.badge}</p>
          </div>
          <div className="mt-2 grid gap-6 lg:grid-cols-[auto_1fr] lg:items-end">
            <div>
              <div className="text-7xl sm:text-8xl font-black tracking-widest leading-none" style={{ color: testDef.color }}>{code}</div>
              <p className="mt-3 font-extrabold text-[#3c3c3c] text-base">
                {top.map((c) => dimensions.find((d) => d.code === c)?.name).join(" · ")}
              </p>
            </div>
            <p className="max-w-2xl text-2xl sm:text-3xl font-black text-[#3c3c3c] leading-snug">
              Îți place să înțelegi cum funcționează lucrurile, să găsești soluții și să transformi ideile în ceva care contează.
            </p>
          </div>
        </div>
      </section>

      {/* Score bars */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
        <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">Imaginea de ansamblu</p>
        <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#3c3c3c]">Cele șase laturi ale profilului tău</h2>
        <div className="mt-8 space-y-5">
          {dimensions.map((dim) => {
            const pct = Math.round(((scores[dim.code] - 6) / 24) * 100);
            const isTop = top.includes(dim.code);
            return (
              <div key={dim.code}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0" style={{ backgroundColor: dim.color }}>{dim.code}</div>
                  <span className="font-extrabold text-[#3c3c3c] text-sm flex-1">{dim.name}</span>
                  {isTop && <span className="text-xs font-black px-2 py-0.5 rounded-full border" style={{ backgroundColor: dim.bg, color: dim.color, borderColor: dim.color + "40" }}>Top {top.indexOf(dim.code) + 1}</span>}
                  <span className="text-sm font-black text-[#3c3c3c] min-w-[2.5rem] text-right">{pct}%</span>
                </div>
                <div className="h-4 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: dim.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Show text answers for text-based tests */}
      {(testDef.id === "hidden_talent" || testDef.id === "quick_reply") && (
        <section className="bg-[#F7F7F7] border-y-2 border-[#E5E5E5] px-5 py-14">
          <div className="max-w-5xl mx-auto">
            <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">Răspunsurile tale</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#3c3c3c]">Ce ai spus</h2>
            <div className="mt-8 space-y-5">
              {testDef.questions.map((q) => {
                const ans = answers[q.id];
                if (!ans) return null;
                return (
                  <div key={q.id} className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-5">
                    <p className="text-xs font-extrabold text-[#afafaf] uppercase tracking-wider mb-2">{q.id}</p>
                    <p className="text-sm font-bold text-[#777] mb-3">{q.text}</p>
                    <p className="text-sm font-extrabold text-[#3c3c3c] leading-relaxed bg-[#F0FFF4] rounded-xl px-4 py-3 border border-[#BBF7D0]">
                      "{String(ans)}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Top 3 dimension cards */}
      <section className="bg-[#F7F7F7] border-y-2 border-[#E5E5E5] px-5 py-14" style={testDef.id === "hidden_talent" || testDef.id === "quick_reply" ? { backgroundColor: "#ffffff", borderTopWidth: "0" } : {}}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">Ce pare să te atragă</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#3c3c3c]">Primele tale trei direcții</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {top.map((c, i) => {
              const dim = dimensions.find((d) => d.code === c)!;
              return (
                <div key={c} className="bg-white rounded-3xl p-6 border-2" style={{ borderColor: dim.color }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg mb-4" style={{ backgroundColor: dim.color }}>{dim.code}</div>
                  <div className="text-xs font-black text-[#afafaf] mb-1">#{i + 1}</div>
                  <h3 className="text-xl font-black text-[#3c3c3c]">{dim.name}</h3>
                  <p className="mt-2 text-sm text-[#777] leading-relaxed font-semibold">{dim.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Career character cards */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
        <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">Personaje care te-ar reprezenta</p>
        <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#3c3c3c]">Direcții care s-ar putea potrivi</h2>
        <p className="mt-1 text-sm text-[#777] font-semibold">Apasă pe un personaj pentru a afla mai multe.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {recommended.map((career) => (
            <CareerCharacterCard key={career.id} career={career} onOpen={() => onCareer(career)} />
          ))}
        </div>
        <div className="mt-10 bg-[#EFF6FF] border-2 border-[#BFDBFE] rounded-2xl p-5 flex gap-3 items-start">
          <span className="text-xl shrink-0">💡</span>
          <p className="text-sm text-[#1D4ED8] font-bold leading-relaxed">
            <strong>De reținut:</strong> Rezultatul este un punct de plecare pentru explorarea carierei. Nu există o singură carieră potrivită pentru tine.
          </p>
        </div>
      </section>

      <section className="border-t-2 border-[#E5E5E5] px-5 py-16 text-center">
        <h2 className="text-2xl font-black text-[#3c3c3c]">Vrei să explorezi mai mult?</h2>
        <p className="mt-2 text-[#777] font-bold text-sm">Încearcă un alt test pentru o perspectivă diferită.</p>
        <Btn variant="outline" onClick={onRetake} size="lg" className="mt-6">🔄 Încearcă alt test</Btn>
      </section>
    </div>
  );
}

// ── CAREER DETAIL ─────────────────────────────────────────────────────────────
function CareerDetail({ career, onBack }: { career: Career; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-2 border-[#E5E5E5] px-5 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Logo />
          <Btn variant="ghost" onClick={onBack} size="sm">← Profilul meu</Btn>
        </div>
      </header>
      <section className="bg-[#F7F7F7] border-b-2 border-[#E5E5E5] px-5 py-14">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-8 items-start">
          {/* Character display */}
          {(() => {
            const char = CAREER_CHARS[career.id] ?? { main: "👤", tool: "⭐", speechBubble: "" };
            const dim  = dimensions.find((d) => d.code === career.codes[0])!;
            return (
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-6xl" style={{ backgroundColor: dim.bg }}>
                    {char.main}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white border-2 border-[#E5E5E5] flex items-center justify-center text-xl shadow-sm">{char.tool}</div>
                </div>
              </div>
            );
          })()}
          <div>
            <div className="text-xs font-black text-[#afafaf] uppercase tracking-widest">{career.field} · Direcție de explorat</div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-black text-[#3c3c3c] leading-tight">{career.title}</h1>
            <p className="mt-4 text-lg text-[#777] leading-relaxed font-semibold max-w-2xl">{career.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {career.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-white border-2 border-[#E5E5E5] rounded-full text-sm font-extrabold text-[#3c3c3c]">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
        <div className="border-l-4 border-[#58CC02] pl-5 mb-10">
          <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">De ce ți s-ar putea potrivi</p>
          <p className="mt-3 text-xl leading-relaxed text-[#3c3c3c] font-extrabold">{career.why}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[{ title: "Ce presupune", items: career.involves, icon: "🎯" }, { title: "Ce poți studia", items: career.studies, icon: "📚" }, { title: "Exemple de roluri", items: career.roles, icon: "🧭" }].map(({ title, items, icon }) => (
            <div key={title} className="bg-[#F7F7F7] rounded-3xl border-2 border-[#E5E5E5] p-6">
              <div className="text-2xl mb-4">{icon}</div>
              <h2 className="text-base font-black text-[#3c3c3c] mb-4">{title}</h2>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-[#777] font-semibold items-start">
                    <span className="text-[#58CC02] shrink-0 mt-0.5 font-black">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-5 bg-[#F0FFF4] border-2 border-[#BBF7D0] rounded-2xl p-6 sm:p-8">
          <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">Perspective profesionale</p>
          <p className="mt-3 text-[#3c3c3c] leading-relaxed font-extrabold">{career.outlook}</p>
        </div>
        <Btn onClick={onBack} variant="outline" size="lg" className="mt-10">← Înapoi la recomandări</Btn>
      </section>
    </div>
  );
}

// ── APP ROOT ───────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,     setScreen]     = useState<Screen>("landing");
  const [activeTest, setActiveTest] = useState<TestDef>(TEST_CATALOG[0]);
  const [current,    setCurrent]    = useState(0);
  const [answers,    setAnswers]    = useState<Record<string, string | number>>({});
  const [career,     setCareer]     = useState<Career | null>(null);

  const scores = useMemo(
    () => scoreTest(activeTest.id, activeTest.questions, answers),
    [activeTest, answers]
  );

  const go = (next: Screen) => { setScreen(next); window.scrollTo({ top: 0 }); };

  const startTest = (testId: TestId) => {
    const def = TEST_CATALOG.find((t) => t.id === testId)!;
    setActiveTest(def);
    setAnswers({});
    setCurrent(0);
    go("intro");
  };

  const retake = () => {
    setAnswers({});
    setCurrent(0);
    setCareer(null);
    go("test_select");
  };

  const handleAnswer = (val: string | number) => {
    const q = activeTest.questions[current];
    if (q) setAnswers((prev) => ({ ...prev, [q.id]: val }));
  };

  const handleNext = () => {
    if (current < activeTest.questions.length - 1) {
      setCurrent(current + 1);
    } else {
      go("complete");
    }
  };

  const handleBack = () => {
    if (current > 0) {
      setCurrent(current - 1);
    } else {
      go("test_select");
    }
  };

  if (screen === "landing")     return <Landing onStart={() => go("test_select")} />;
  if (screen === "test_select") return <TestSelector onSelect={startTest} onBack={() => go("landing")} />;
  if (screen === "intro")       return <Intro testDef={activeTest} onBack={() => go("test_select")} onStart={() => go("test")} />;
  if (screen === "test")
    return (
      <Test
        testDef={activeTest}
        answers={answers}
        current={current}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onBack={handleBack}
      />
    );
  if (screen === "complete") return <Completion onShow={() => go("results")} />;
  if (screen === "career" && career) return <CareerDetail career={career} onBack={() => go("results")} />;
  return (
    <Results
      testDef={activeTest}
      scores={scores}
      answers={answers}
      onRetake={retake}
      onCareer={(c) => { setCareer(c); go("career"); }}
    />
  );
}
