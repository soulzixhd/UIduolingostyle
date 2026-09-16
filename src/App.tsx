import { useState, useMemo } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
type RiasecCode = "R" | "I" | "A" | "S" | "E" | "C";
type Screen = "landing" | "intro" | "test" | "complete" | "results" | "career";

interface Question  { id: number; dimension: RiasecCode; text: string; }
interface Dimension { code: RiasecCode; name: string; short: string; description: string; color: string; bg: string; }
interface Career    {
  id: string; title: string; field: string; codes: RiasecCode[];
  summary: string; tags: string[]; why: string;
  involves: string[]; studies: string[]; roles: string[]; outlook: string;
}
interface QuestionTheme { bg: string; s1: string; s2: string; isDark: boolean; }

// ── Dimensions ───────────────────────────────────────────────────────────────
const dimensions: Dimension[] = [
  { code: "R", name: "Realistic",     short: "Practic",    description: "Practic, tehnic, orientat spre lucruri concrete.", color: "#F97316", bg: "#FFF7ED" },
  { code: "I", name: "Investigative", short: "Analitic",   description: "Curios, analitic, atras de probleme și idei.",     color: "#3B82F6", bg: "#EFF6FF" },
  { code: "A", name: "Artistic",      short: "Creativ",    description: "Creativ, expresiv, atras de design și idei noi.",  color: "#A855F7", bg: "#FAF5FF" },
  { code: "S", name: "Social",        short: "Empatic",    description: "Orientat spre oameni, ajutor și colaborare.",      color: "#EF4444", bg: "#FFF5F5" },
  { code: "E", name: "Enterprising",  short: "Inițiativă", description: "Leadership, inițiativă, business și persuasiune.", color: "#22C55E", bg: "#F0FFF4" },
  { code: "C", name: "Conventional",  short: "Organizat",  description: "Organizare, structură, date și proceduri.",        color: "#6366F1", bg: "#EEF2FF" },
];

// ── Questions ─────────────────────────────────────────────────────────────────
const prompts: Record<RiasecCode, string[]> = {
  R: [
    "Îmi place să repar lucruri mecanice sau electronice.",
    "Mă atrag activitățile practice, în care construiesc ceva.",
    "Aș prefera să lucrez cu unelte sau echipamente.",
    "Îmi place să văd un rezultat concret al muncii mele.",
    "Mă simt bine când rezolv o problemă practică.",
    "Mi-ar plăcea să lucrez uneori în aer liber sau pe teren.",
  ],
  I: [
    "Îmi place să aflu de ce și cum funcționează lucrurile.",
    "Mă atrag problemele care cer logică și răbdare.",
    "Îmi place să caut informații înainte să trag o concluzie.",
    "Experimentele și descoperirile îmi stârnesc curiozitatea.",
    "Mă bucur când găsesc o explicație bună pentru ceva complicat.",
    "Aș lucra cu plăcere la o întrebare fără răspuns evident.",
  ],
  A: [
    "Îmi place să găsesc soluții originale, chiar dacă sunt neobișnuite.",
    "Mă atrag desenul, muzica, scrisul sau designul.",
    "Îmi place să îmi exprim ideile într-un mod personal.",
    "Observ detalii de culoare, formă sau stil.",
    "Prefer proiectele în care am libertate de creație.",
    "Îmi place să imaginez cum ar putea arăta ceva nou.",
  ],
  S: [
    "Îmi place să îi ajut pe ceilalți să înțeleagă ceva.",
    "Mă simt bine când lucrez împreună cu alți oameni.",
    "Prietenii apelează uneori la mine când au nevoie să vorbească.",
    "Mi-ar plăcea să contribui la binele unei comunități.",
    "Am răbdare să ascult puncte de vedere diferite.",
    "Mă motivează să văd că munca mea ajută pe cineva.",
  ],
  E: [
    "Îmi place să pornesc proiecte și să îi mobilizez pe ceilalți.",
    "Mă simt confortabil să îmi susțin ideile în fața unui grup.",
    "Mă atrag negocierile și găsirea unei soluții bune pentru toți.",
    "Îmi place să iau inițiativa când ceva trebuie organizat.",
    "Mă interesează cum cresc ideile în proiecte sau afaceri.",
    "Aș coordona cu plăcere o echipă pentru un scop comun.",
  ],
  C: [
    "Îmi place să pun informațiile într-o ordine clară.",
    "Mă simt bine când am un plan și pași concreți.",
    "Observ repede când lipsesc detalii importante.",
    "Îmi place să lucrez cu date, tabele sau liste.",
    "Prefer sarcinile în care știu ce rezultat este așteptat.",
    "Îmi place să fac un sistem mai simplu și mai eficient.",
  ],
};

const RIASEC_ORDER: RiasecCode[] = ["R", "I", "A", "S", "E", "C"];
const questions: Question[] = Array.from({ length: 6 }, (_, round) =>
  RIASEC_ORDER.map((dim) => ({ dimension: dim, text: prompts[dim][round] ?? "" }))
).flat().map((q, i) => ({ ...q, id: i + 1 }));

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

const ANSWER_LABELS = ["Dezacord total", "Mai degrabă nu", "Neutru", "Mai degrabă da", "Acord total"];

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ── Color theme for each question ─────────────────────────────────────────────
function getQuestionTheme(index: number): QuestionTheme {
  const t = index / Math.max(questions.length - 1, 1);
  // Journey: deep indigo (hue 250) → violet → magenta → rose → warm peach (hue 30)
  const hue = 250 + t * 140; // 250 → 390 (=30 wrapped)
  const bgL  = 12 + t * 72;  // 12% → 84% lightness
  const bgS  = 65 + t * 5;   // 65% → 70% saturation
  return {
    bg: `hsl(${hue}, ${bgS}%, ${bgL}%)`,
    s1: `hsla(${hue - 18}, 80%, ${Math.min(bgL + 14, 94)}%, 0.38)`,
    s2: `hsla(${hue + 22}, 70%, ${Math.min(bgL + 26, 97)}%, 0.26)`,
    isDark: bgL < 50,
  };
}

// ── Background blob shapes (4 variants) ──────────────────────────────────────
function Shapes({ s1, s2, variant }: { s1: string; s2: string; variant: number }) {
  const v = variant % 4;
  if (v === 0) return (
    <>
      <div style={{ position: "absolute", inset: 0, top: "-70px", right: "-60px", width: "320px", height: "320px", background: s1, borderRadius: "67% 33% 58% 42% / 43% 55% 45% 57%" }} />
      <div style={{ position: "absolute", bottom: "50px", left: "-50px", width: "200px", height: "200px", background: s2, borderRadius: "42% 58% 70% 30% / 60% 40% 60% 40%" }} />
      <div style={{ position: "absolute", top: "42%", left: "6%",  width: "90px",  height: "90px",  background: s1, borderRadius: "50%" }} />
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
      <div style={{ position: "absolute", bottom: "-80px", left: "18%",  width: "270px", height: "270px", background: s1, borderRadius: "60% 40% 30% 70% / 50% 60% 40% 50%" }} />
    </>
  );
  // variant 3
  return (
    <>
      <div style={{ position: "absolute", bottom: "-65px", right: "-80px", width: "360px", height: "260px", background: s2, borderRadius: "70% 30% 60% 40% / 40% 60% 40% 60%" }} />
      <div style={{ position: "absolute", top: "20%", left: "-25px", width: "150px", height: "150px", background: s1, borderRadius: "40% 60% 70% 30% / 50% 40% 60% 50%" }} />
      <div style={{ position: "absolute", top: "8%",  right: "18%", width: "85px",  height: "85px",  background: s2, borderRadius: "50%" }} />
    </>
  );
}

// ── Reusable button ───────────────────────────────────────────────────────────
type BtnVariant = "primary" | "outline" | "ghost";
type BtnSize    = "sm" | "md" | "lg";

function Btn({
  children, onClick, disabled = false,
  variant = "primary", size = "md", className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: BtnVariant;
  size?: BtnSize;
  className?: string;
}) {
  const base = "inline-flex items-center justify-center gap-2 font-extrabold rounded-2xl transition-all duration-75 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0";
  const sizes: Record<BtnSize, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
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

// ── Logo ──────────────────────────────────────────────────────────────────────
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

// ── "Cum funcționează?" Modal ─────────────────────────────────────────────────
const HOW_STEPS = [
  {
    n: "01", icon: "✏️", color: "#3B82F6", bg: "#EFF6FF",
    title: "Răspunde la întrebări",
    desc: "Completează chestionarul RIASEC prin răspunsuri sincere.",
  },
  {
    n: "02", icon: "🔍", color: "#A855F7", bg: "#FAF5FF",
    title: "Descoperă-ți profilul",
    desc: "Vei primi cele 3 litere care îți descriu cel mai bine profilul personal.",
  },
  {
    n: "03", icon: "🗺️", color: "#22C55E", bg: "#F0FFF4",
    title: "Explorează posibilitățile",
    desc: "Vei vedea domenii și cariere care ți se potrivesc și te pot inspira.",
  },
];

function HowItWorksModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-modal-overlay" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
      {/* Overlay click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-7 sm:p-10 animate-modal-card overflow-y-auto max-h-[90vh]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-[#f7f7f7] text-[#777] hover:bg-[#e5e5e5] hover:text-[#3c3c3c] font-black text-base transition-colors"
        >
          ✕
        </button>

        <div className="text-3xl mb-3">🧭</div>
        <h2 className="text-2xl font-black text-[#3c3c3c]">Cum funcționează?</h2>
        <p className="mt-1 text-sm text-[#777] font-bold">Trei pași spre mai multă claritate</p>

        <div className="mt-7 space-y-4">
          {HOW_STEPS.map(({ n, icon, color, bg, title, desc }) => (
            <div key={n} className="flex gap-4 items-start rounded-2xl p-4 border-2" style={{ borderColor: color + "33", backgroundColor: bg }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm" style={{ backgroundColor: color + "20", border: `2px solid ${color}40` }}>
                {icon}
              </div>
              <div>
                <div className="text-xs font-black mb-0.5" style={{ color: color }}>{n}</div>
                <h3 className="font-black text-[#3c3c3c] text-base leading-tight">{title}</h3>
                <p className="mt-1 text-sm text-[#777] font-semibold leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Btn onClick={onClose} size="lg" className="w-full mt-7">
          Am înțeles 👍
        </Btn>
      </div>
    </div>
  );
}

// ── LANDING ───────────────────────────────────────────────────────────────────
function Landing({ onStart }: { onStart: () => void }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Logo />
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => setShowModal(true)} className="text-sm font-bold text-[#777] hover:text-[#3c3c3c] transition-colors">
            Cum funcționează
          </button>
          <a href="#despre-test" className="text-sm font-bold text-[#777] hover:text-[#3c3c3c] transition-colors">
            Despre test
          </a>
        </nav>
        <Btn onClick={onStart} size="md">Începe testul →</Btn>
      </header>

      {/* Hero */}
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
            Descoperă ce domenii și cariere s-ar putea potrivi cu interesele tale. Fără presiune, fără răspunsuri greșite.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Btn onClick={onStart} size="lg">🚀 Începe testul</Btn>
            <Btn variant="outline" size="lg" onClick={() => setShowModal(true)}>
              Cum funcționează?
            </Btn>
          </div>
          <p className="mt-4 text-sm text-[#afafaf] font-bold">⏱️ 10–15 minute · fără cont necesar</p>
        </div>

        {/* Decorative path visual */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-[#58CC02] rounded-2xl shadow-[0_5px_0_#46A302] flex items-center justify-center text-3xl z-10">
                🧭
              </div>
            </div>
            {[
              { label: "🔧 Tehnic",   pos: "top-0 left-1/2 -translate-x-1/2", c: "#F97316", bg: "#FFF7ED" },
              { label: "💡 Idei",     pos: "top-1/2 right-0 -translate-y-1/2", c: "#3B82F6", bg: "#EFF6FF" },
              { label: "🎨 Design",   pos: "bottom-2 right-4",                 c: "#A855F7", bg: "#FAF5FF" },
              { label: "🤝 Oameni",   pos: "bottom-2 left-4",                  c: "#EF4444", bg: "#FFF5F5" },
              { label: "📈 Business", pos: "top-1/2 left-0 -translate-y-1/2",  c: "#22C55E", bg: "#F0FFF4" },
            ].map(({ label, pos, c, bg }) => (
              <div key={label} className={`absolute ${pos} px-3 py-2 rounded-xl font-extrabold text-xs border-2`} style={{ backgroundColor: bg, borderColor: c, color: c }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="cum-functioneaza" className="bg-[#F7F7F7] border-y-2 border-[#E5E5E5] py-20 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">Simplu, de la prima întrebare</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-[#3c3c3c]">Trei pași spre mai multă claritate</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {[
              { num: "01", icon: "✏️", title: "Răspunzi",  desc: "Ne spui ce îți place și ce te interesează." },
              { num: "02", icon: "🔍", title: "Descoperi", desc: "Îți conturăm profilul de interese." },
              { num: "03", icon: "🗺️", title: "Explorezi", desc: "Vezi domenii și cariere care s-ar putea potrivi." },
            ].map(({ num, icon, title, desc }) => (
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

      {/* Reassurance */}
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

// ── INTRO ─────────────────────────────────────────────────────────────────────
function Intro({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between px-5 py-5 sm:px-8">
        <Logo onClick={onBack} />
        <Btn variant="ghost" onClick={onBack} size="sm">← Înapoi</Btn>
      </header>
      <section className="flex-1 flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="max-w-lg w-full text-center animate-slide-up">
          <div className="text-6xl mb-4">🌟</div>
          <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">Înainte să începem</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-black text-[#3c3c3c] leading-tight">
            Hai să aflăm ce ți se potrivește.
          </h1>
          <p className="mt-5 text-base text-[#777] leading-relaxed font-semibold max-w-sm mx-auto">
            Testul te ajută să îți descoperi interesele și să explorezi direcții profesionale care s-ar putea potrivi cu tine.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[{ val: "36", label: "întrebări" }, { val: "10–15", label: "minute" }, { val: "✓", label: "fără răspunsuri corecte" }].map(({ val, label }) => (
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
          <Btn onClick={onStart} size="lg" className="mt-8 w-full">Începe testul 🚀</Btn>
        </div>
      </section>
    </div>
  );
}

// ── TEST (with animated colored background) ───────────────────────────────────
function Test({
  answers, current, onAnswer, onNext, onBack,
}: {
  answers: Record<number, number>;
  current: number;
  onAnswer: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const question = questions[current];
  if (!question) return null;

  const selected  = answers[question.id];
  const progress  = ((current + 1) / questions.length) * 100;
  const isLast    = current === questions.length - 1;
  const theme     = getQuestionTheme(current);
  const variant   = current % 4;

  const handleNext = () => { setDirection("forward"); onNext(); };
  const handleBack = () => { setDirection("back");    onBack(); };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: theme.bg, transition: "background-color 700ms ease" }}
    >
      {/* Animated background shapes */}
      <div key={`shapes-${current}`} className="absolute inset-0 pointer-events-none overflow-hidden animate-shapes-enter">
        <Shapes s1={theme.s1} s2={theme.s2} variant={variant} />
      </div>

      {/* Progress bar header */}
      <div className="relative z-10 px-4 pt-5 pb-3 sm:px-6">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center rounded-full font-black text-sm transition-all shrink-0"
            style={{ background: "rgba(255,255,255,0.2)", color: theme.isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.5)" }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "rgba(255,255,255,0.32)"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "rgba(255,255,255,0.2)"; }}
          >
            ✕
          </button>

          <div className="flex-1 h-3.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.25)" }}>
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%`, background: theme.isDark ? "rgba(255,255,255,0.9)" : "#58CC02" }}
            />
          </div>

          <span
            className="text-sm font-black shrink-0 min-w-[3rem] text-right"
            style={{ color: theme.isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.55)" }}
          >
            {current + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Question card */}
      <div className="relative z-10 flex-1 px-4 pb-6 pt-4 sm:px-6 flex items-start sm:items-center justify-center">
        <div
          key={`card-${current}`}
          className={cn(
            "w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8",
            direction === "forward" ? "animate-card-right" : "animate-card-left"
          )}
        >
          <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest mb-4">
            Alege varianta care te reprezintă
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-[#3c3c3c] leading-snug mb-6">
            {question.text}
          </h1>

          <fieldset className="space-y-2.5">
            <legend className="sr-only">Selectează un răspuns</legend>
            {ANSWER_LABELS.map((label, index) => {
              const value      = index + 1;
              const isSelected = selected === value;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onAnswer(value)}
                  className={cn(
                    "w-full flex items-center gap-3.5 p-3.5 rounded-2xl border-2 text-left transition-all duration-150 cursor-pointer",
                    isSelected
                      ? "border-[#58CC02] bg-[#F0FFF4] shadow-[0_2px_0_#b8f5b8]"
                      : "border-[#E5E5E5] bg-white hover:border-[#93C5FD] hover:bg-[#EFF6FF]"
                  )}
                >
                  <span
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 transition-all",
                      isSelected
                        ? "bg-[#58CC02] text-white shadow-[0_2px_0_#46A302]"
                        : "bg-[#F7F7F7] text-[#afafaf] border-2 border-[#E5E5E5]"
                    )}
                  >
                    {isSelected ? "✓" : value}
                  </span>
                  <span className={cn("flex-1 font-extrabold text-sm", isSelected ? "text-[#166534]" : "text-[#3c3c3c]")}>
                    {label}
                  </span>
                  {isSelected && <span className="text-[#58CC02] font-black text-base shrink-0">●</span>}
                </button>
              );
            })}
          </fieldset>

          <div className="mt-6 space-y-2">
            <Btn onClick={handleNext} disabled={!selected} size="lg" className="w-full">
              {isLast ? "🎯 Vezi rezultatul" : "Continuă →"}
            </Btn>
            {!selected && (
              <p className="text-center text-xs text-[#afafaf] font-bold">Alege o variantă pentru a continua.</p>
            )}
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
          Am pus cap la cap răspunsurile tale. Urmează câteva direcții de explorat — nu o decizie pe care trebuie să o iei acum.
        </p>
        <div className="mt-8 bg-[#F0FFF4] border-2 border-[#BBF7D0] rounded-2xl p-6">
          <div className="text-3xl mb-2">🌱</div>
          <p className="font-extrabold text-[#166534] text-sm">
            Acesta este un punct de plecare. Explorarea ta continuă de aici.
          </p>
        </div>
        <Btn onClick={onShow} size="lg" className="mt-8 w-full">🗺️ Vezi profilul meu</Btn>
      </div>
    </div>
  );
}

// ── RESULTS ───────────────────────────────────────────────────────────────────
function Results({
  scores, onCareer, onRetake,
}: {
  scores: Record<RiasecCode, number>;
  onCareer: (c: Career) => void;
  onRetake: () => void;
}) {
  const top = useMemo(
    () => [...dimensions].sort((a, b) => scores[b.code] - scores[a.code]).slice(0, 3).map((d) => d.code),
    [scores]
  );
  const code = top.join("");
  const recommended = useMemo(
    () =>
      [...careers]
        .sort(
          (a, b) =>
            b.codes.reduce((t, c, i) => t + (top.includes(c) ? 3 - i : 0), 0) -
            a.codes.reduce((t, c, i) => t + (top.includes(c) ? 3 - i : 0), 0)
        )
        .slice(0, 3),
    [top]
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-2 border-[#E5E5E5] px-5 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo />
          <Btn variant="outline" onClick={onRetake} size="sm">🔄 Refă testul</Btn>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#F0FFF4] border-b-2 border-[#BBF7D0] px-5 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">Profilul tău</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[auto_1fr] lg:items-end">
            <div>
              <div className="text-7xl sm:text-8xl font-black text-[#58CC02] tracking-widest leading-none">{code}</div>
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
        <p className="mt-1 text-sm text-[#777] font-semibold">Un scor mai mare arată că acele activități îți trezesc mai des interesul.</p>
        <div className="mt-8 space-y-5">
          {dimensions.map((dim) => {
            const pct   = Math.round(((scores[dim.code] - 6) / 24) * 100);
            const isTop = top.includes(dim.code);
            return (
              <div key={dim.code}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm" style={{ backgroundColor: dim.color }}>
                    {dim.code}
                  </div>
                  <span className="font-extrabold text-[#3c3c3c] text-sm flex-1">{dim.name}</span>
                  {isTop && (
                    <span className="text-xs font-black px-2 py-0.5 rounded-full border" style={{ backgroundColor: dim.bg, color: dim.color, borderColor: dim.color + "40" }}>
                      Top {top.indexOf(dim.code) + 1}
                    </span>
                  )}
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

      {/* Top 3 cards */}
      <section className="bg-[#F7F7F7] border-y-2 border-[#E5E5E5] px-5 py-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">Ce pare să te atragă</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#3c3c3c]">Primele tale trei direcții</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {top.map((c, i) => {
              const dim = dimensions.find((d) => d.code === c)!;
              return (
                <div key={c} className="bg-white rounded-3xl p-6 border-2" style={{ borderColor: dim.color }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg mb-4 shadow-sm" style={{ backgroundColor: dim.color }}>
                    {dim.code}
                  </div>
                  <div className="text-xs font-black text-[#afafaf] mb-1">#{i + 1}</div>
                  <h3 className="text-xl font-black text-[#3c3c3c]">{dim.name}</h3>
                  <p className="mt-2 text-sm text-[#777] leading-relaxed font-semibold">{dim.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
        <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">Un loc bun de unde să începi</p>
        <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#3c3c3c]">Direcții care s-ar putea potrivi</h2>
        <p className="mt-1 text-sm text-[#777] font-semibold">Nu sunt singurele opțiuni. Deschide-le pe cele care îți stârnesc curiozitatea.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {recommended.map((career) => (
            <div key={career.id} className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6 flex flex-col hover:border-[#58CC02] transition-colors duration-200">
              <div className="text-xs font-black text-[#afafaf] uppercase tracking-wider">{career.field}</div>
              <h3 className="mt-2 text-xl font-black text-[#3c3c3c]">{career.title}</h3>
              <p className="mt-3 text-sm text-[#777] leading-relaxed font-semibold flex-1">{career.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">{career.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
              <Btn onClick={() => onCareer(career)} size="sm" variant="outline" className="mt-5 w-full">Explorează →</Btn>
            </div>
          ))}
        </div>
        <div className="mt-10 bg-[#EFF6FF] border-2 border-[#BFDBFE] rounded-2xl p-5 flex gap-3 items-start">
          <span className="text-xl shrink-0">💡</span>
          <p className="text-sm text-[#1D4ED8] font-bold leading-relaxed">
            <strong>De reținut:</strong> Rezultatul este un punct de plecare pentru explorarea carierei. Nu există o singură carieră potrivită pentru tine.
          </p>
        </div>
      </section>

      {/* Retake */}
      <section className="border-t-2 border-[#E5E5E5] px-5 py-16 text-center">
        <h2 className="text-2xl font-black text-[#3c3c3c]">Nu te regăsești complet în rezultat?</h2>
        <p className="mt-2 text-[#777] font-bold text-sm">Poți răspunde din nou, fără nicio presiune.</p>
        <Btn variant="outline" onClick={onRetake} size="lg" className="mt-6">🔄 Refă testul</Btn>
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
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-black text-[#afafaf] uppercase tracking-widest">{career.field} · Direcție de explorat</div>
          <h1 className="mt-4 text-4xl sm:text-6xl font-black text-[#3c3c3c] leading-tight">{career.title}</h1>
          <p className="mt-5 text-lg text-[#777] leading-relaxed font-semibold max-w-3xl">{career.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {career.tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 bg-white border-2 border-[#E5E5E5] rounded-full text-sm font-extrabold text-[#3c3c3c]">{tag}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
        <div className="border-l-4 border-[#58CC02] pl-5 mb-10">
          <p className="text-[#afafaf] font-extrabold text-xs uppercase tracking-widest">De ce ți s-ar putea potrivi</p>
          <p className="mt-3 text-xl leading-relaxed text-[#3c3c3c] font-extrabold">{career.why}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "Ce presupune",      items: career.involves, icon: "🎯" },
            { title: "Ce poți studia",    items: career.studies,  icon: "📚" },
            { title: "Exemple de roluri", items: career.roles,    icon: "🧭" },
          ].map(({ title, items, icon }) => (
            <div key={title} className="bg-[#F7F7F7] rounded-3xl border-2 border-[#E5E5E5] p-6">
              <div className="text-2xl mb-4">{icon}</div>
              <h2 className="text-base font-black text-[#3c3c3c] mb-4">{title}</h2>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-[#777] font-semibold items-start">
                    <span className="text-[#58CC02] shrink-0 mt-0.5 font-black">✓</span>
                    {item}
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
  const [screen,  setScreen]  = useState<Screen>("landing");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [career,  setCareer]  = useState<Career | null>(null);

  const scores = useMemo(
    () =>
      dimensions.reduce(
        (acc, d) => ({
          ...acc,
          [d.code]: questions
            .filter((q) => q.dimension === d.code)
            .reduce((sum, q) => sum + (answers[q.id] ?? 1), 0),
        }),
        {} as Record<RiasecCode, number>
      ),
    [answers]
  );

  const go = (next: Screen) => { setScreen(next); window.scrollTo({ top: 0 }); };

  const retake = () => { setAnswers({}); setCurrent(0); setCareer(null); go("intro"); };

  if (screen === "landing") return <Landing onStart={() => go("intro")} />;
  if (screen === "intro")   return <Intro onBack={() => go("landing")} onStart={() => go("test")} />;
  if (screen === "test")
    return (
      <Test
        answers={answers}
        current={current}
        onAnswer={(value) => { const q = questions[current]; if (q) setAnswers((prev) => ({ ...prev, [q.id]: value })); }}
        onBack={() => (current ? setCurrent(current - 1) : go("intro"))}
        onNext={() => (current < questions.length - 1 ? setCurrent(current + 1) : go("complete"))}
      />
    );
  if (screen === "complete") return <Completion onShow={() => go("results")} />;
  if (screen === "career" && career) return <CareerDetail career={career} onBack={() => go("results")} />;
  return (
    <Results
      scores={scores}
      onRetake={retake}
      onCareer={(c) => { setCareer(c); go("career"); }}
    />
  );
}
