// @ts-nocheck
import React, { useState, useRef, useEffect, Suspense, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

/* ══════════════════════════════════════════════
   ICONS (Simple SVG so we don't need lucide)
══════════════════════════════════════════════ */
const Icon = ({ d, size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  home: (p) => <Icon {...p} d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />,
  flask: (p) => <Icon {...p} d="M9 3h6 M10 9V3 M14 9V3 M8.5 14l-2.8 5.6a1 1 0 0 0 .9 1.4h10.8a1 1 0 0 0 .9-1.4L15.5 14 M8.5 14h7 M12 9a4 4 0 0 0-4 4" />,
  dumbbell: (p) => (
    <svg width={p.size || 20} height={p.size || 20} viewBox="0 0 24 24" fill="none"
      stroke={p.color || "currentColor"} strokeWidth="2" strokeLinecap="round">
      <path d="M6.5 6.5h11 M6.5 17.5h11 M3 10h1.5 M3 14h1.5 M19.5 10H21 M19.5 14H21 M4.5 6.5v11 M19.5 6.5v11 M6.5 4v16 M17.5 4v16"/>
    </svg>
  ),
  code: (p) => <Icon {...p} d="M16 18l6-6-6-6 M8 6l-6 6 6 6" />,
  globe: (p) => (
    <svg width={p.size || 20} height={p.size || 20} viewBox="0 0 24 24" fill="none"
      stroke={p.color || "currentColor"} strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  plus: (p) => <Icon {...p} d="M12 5v14 M5 12h14" />,
  x: (p) => <Icon {...p} d="M18 6L6 18 M6 6l12 12" />,
  link: (p) => <Icon {...p} d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3" />,
  trash: (p) => <Icon {...p} d="M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />,
  folder: (p) => <Icon {...p} d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
  file: (p) => <Icon {...p} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" />,
  microscope: (p) => <Icon {...p} d="M6 18h8 M3 22h18 M14 22a7 7 0 1 0-1-13 M9 14h2 M9 12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2" />,
  book: (p) => <Icon {...p} d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />,
  star: (p) => <Icon {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  arrow: (p) => <Icon {...p} d="M12 19V5 M5 12l7-7 7 7" />,
  zap: (p) => <Icon {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  chevron: (p) => <Icon {...p} d="M9 18l6-6-6-6" />,
  eye: (p) => (
    <svg width={p.size || 20} height={p.size || 20} viewBox="0 0 24 24" fill="none"
      stroke={p.color || "currentColor"} strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
};

/* ══════════════════════════════════════════════
   3D SCENE
══════════════════════════════════════════════ */
function GlowCore() {
  const mesh = useRef(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const s = 0.45 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
    mesh.current.scale.set(s, s, s);
  });
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#a78bfa" emissive="#7c3aed" emissiveIntensity={2} transparent opacity={0.5} />
    </mesh>
  );
}

function WireIcosahedron() {
  const mesh = useRef(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.15;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.8, 1]} />
      <meshStandardMaterial color="#6366f1" wireframe transparent opacity={0.5} />
    </mesh>
  );
}

function WireOctahedron() {
  const mesh = useRef(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = -state.clock.elapsedTime * 0.3;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.25;
  });
  return (
    <mesh ref={mesh}>
      <octahedronGeometry args={[0.9, 0]} />
      <meshStandardMaterial color="#06b6d4" wireframe transparent opacity={0.7} />
    </mesh>
  );
}

function OrbitRing({ radius, speed, color, tilt }) {
  const particleRef = useRef(null);
  useFrame((state) => {
    if (!particleRef.current) return;
    const t = state.clock.elapsedTime * speed;
    particleRef.current.position.x = Math.cos(t) * radius;
    particleRef.current.position.z = Math.sin(t) * radius;
    particleRef.current.position.y = Math.sin(t * 0.5) * 0.3;
  });
  return (
    <group rotation={tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.01, 16, 100]} />
        <meshStandardMaterial color={color} transparent opacity={0.15} />
      </mesh>
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

function SmallStar({ position, size }) {
  const mesh = useRef(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.3;
  });
  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
    </mesh>
  );
}

function Scene({ mouse }) {
  const group = useRef(null);
  useFrame(() => {
    if (!group.current || !mouse.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouse.current.x * 0.3, 0.03);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouse.current.y * 0.15, 0.03);
  });

  const stars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 80; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16],
        size: Math.random() * 0.03 + 0.01,
      });
    }
    return arr;
  }, []);

  return (
    <>
      <group ref={group}>
        <GlowCore />
        <WireOctahedron />
        <WireIcosahedron />
        <OrbitRing radius={2.8} speed={0.8} color="#06b6d4" tilt={[0.3, 0, 0]} />
        <OrbitRing radius={3.3} speed={0.6} color="#a78bfa" tilt={[-0.5, 0.4, 0]} />
        <OrbitRing radius={3.8} speed={0.4} color="#34d399" tilt={[0.8, -0.3, 0.2]} />
      </group>
      {stars.map((s, i) => (
        <SmallStar key={i} position={s.pos} size={s.size} />
      ))}
    </>
  );
}

function HeroCanvas() {
  const mouse = useRef({ x: 0, y: 0 });
  return (
    <div
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#818cf8" />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#06b6d4" />
        <Suspense fallback={null}>
          <Scene mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ERROR BOUNDARY — if 3D crashes, app still works
══════════════════════════════════════════════ */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1))",
        }}>
          <p style={{ color: "#64748b" }}>3D scene unavailable</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function SafeHeroCanvas() {
  return (
    <ErrorBoundary>
      <HeroCanvas />
    </ErrorBoundary>
  );
}

/* ══════════════════════════════════════════════
   LOCAL STORAGE HELPER
══════════════════════════════════════════════ */
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }, [key, val]);
  return [val, setVal];
}

/* ══════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════ */
const S = {
  glass: {
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
  },
  gradBtn: {
    background: "linear-gradient(135deg, #6366f1, #06b6d4)", border: "none",
    color: "white", borderRadius: "12px", fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
  },
  input: {
    width: "100%", padding: "12px 16px", borderRadius: "12px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box",
    fontFamily: "inherit",
  },
};

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
export default function App() {
  const [tab, setTab] = useState("home");
  const [chemTab, setChemTab] = useState("sop");
  const [modal, setModal] = useState(null);
  const [showTop, setShowTop] = useState(false);

  // ─── DATA STORES ───
  const [chemSop, setChemSop] = useLocalStorage("pf2_sop", [
    { id: 1, title: "Acid-Base Titration SOP", desc: "Standard procedure for volumetric acid-base titration using phenolphthalein indicator.", tags: ["Analytical", "Titration"] },
  ]);
  const [chemMethods, setChemMethods] = useLocalStorage("pf2_methods", [
    { id: 1, title: "HPLC Method for Paracetamol", desc: "Reversed-phase HPLC method using C18 column with UV detection at 243nm.", tags: ["HPLC", "Pharma"] },
  ]);
  const [chemInstruments, setChemInstruments] = useLocalStorage("pf2_instruments", [
    { id: 1, title: "UV-Vis Spectrophotometer", desc: "Operation, calibration and maintenance of double-beam UV-Vis instrument.", tags: ["Spectroscopy"] },
  ]);
  const [chemKnowledge, setChemKnowledge] = useLocalStorage("pf2_knowledge", [
    { id: 1, title: "Buffer Solutions Theory", desc: "Understanding Henderson-Hasselbalch equation and buffer capacity.", tags: ["Theory", "pH"] },
  ]);
  const [calisthenicsData, setCalisthenicsData] = useLocalStorage("pf2_cal", [
    { id: 1, title: "Muscle Up Progression", desc: "From dead hang to clean muscle-up: band-assisted, explosive pull-up, transition work, full MU.", tags: ["Advanced", "Pull"] },
    { id: 2, title: "Handstand Hold", desc: "Wall-assisted to freestanding: wrist prep, kick-ups, balance drills, 60s hold target.", tags: ["Balance", "Push"] },
  ]);
  const [pythonData, setPythonData] = useLocalStorage("pf2_py", [
    { id: 1, title: "Web Scraper Bot", desc: "Automated data extraction with BeautifulSoup and Selenium for price monitoring.", tags: ["Automation", "Selenium"], github: "https://github.com" },
    { id: 2, title: "Data Analysis Dashboard", desc: "Pandas and Matplotlib tool for CSV data visualization and reports.", tags: ["Pandas", "Data Science"], github: "" },
  ]);
  const [websitesData, setWebsitesData] = useLocalStorage("pf2_web", [
    { id: 1, title: "Dairy Management System", desc: "Full-stack milk dairy app with customer ledger, feed tracking, and financial dashboard.", url: "https://example.com", tags: ["React", "Tailwind"] },
    { id: 2, title: "Portfolio Website", desc: "This portfolio with 3D hero, glassmorphic design, and multiple sections.", url: "", tags: ["React", "Three.js"] },
  ]);

  // ─── FORM ───
  const [form, setForm] = useState({ title: "", desc: "", tags: "", url: "", github: "" });
  const resetForm = () => setForm({ title: "", desc: "", tags: "", url: "", github: "" });

  // ─── SCROLL ───
  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ─── ADD / DELETE ───
  const addItem = () => {
    if (!form.title.trim()) return;
    const n = {
      id: Date.now(), title: form.title, desc: form.desc,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      url: form.url, github: form.github,
    };
    const map = {
      "chem-sop": setChemSop, "chem-methods": setChemMethods,
      "chem-instruments": setChemInstruments, "chem-knowledge": setChemKnowledge,
      "calisthenics": setCalisthenicsData, "python": setPythonData, "websites": setWebsitesData,
    };
    if (map[modal]) map[modal]((p) => [n, ...p]);
    resetForm();
    setModal(null);
  };

  const deleteItem = (section, id) => {
    const map = {
      "chem-sop": setChemSop, "chem-methods": setChemMethods,
      "chem-instruments": setChemInstruments, "chem-knowledge": setChemKnowledge,
      "calisthenics": setCalisthenicsData, "python": setPythonData, "websites": setWebsitesData,
    };
    if (map[section]) map[section]((p) => p.filter((i) => i.id !== id));
  };

  const chemSections = {
    sop: { data: chemSop, label: "SOP", iconKey: "file" },
    methods: { data: chemMethods, label: "Methods", iconKey: "flask" },
    instruments: { data: chemInstruments, label: "Instruments", iconKey: "microscope" },
    knowledge: { data: chemKnowledge, label: "Knowledge", iconKey: "book" },
  };

  const totalChem = chemSop.length + chemMethods.length + chemInstruments.length + chemKnowledge.length;

  // ─── BADGE ───
  const Badge = ({ text, idx }) => {
    const colors = [
      { bg: "rgba(99,102,241,0.2)", border: "rgba(99,102,241,0.3)", text: "#a5b4fc" },
      { bg: "rgba(6,182,212,0.2)", border: "rgba(6,182,212,0.3)", text: "#67e8f9" },
      { bg: "rgba(16,185,129,0.2)", border: "rgba(16,185,129,0.3)", text: "#6ee7b7" },
      { bg: "rgba(245,158,11,0.2)", border: "rgba(245,158,11,0.3)", text: "#fcd34d" },
      { bg: "rgba(244,63,94,0.2)", border: "rgba(244,63,94,0.3)", text: "#fda4af" },
    ];
    const c = colors[idx % colors.length];
    return <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "999px", background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>{text}</span>;
  };

  // ─── ITEM CARD ───
  const ItemCard = ({ item, section, showUrl, showGithub }) => (
    <div style={{ ...S.glass, padding: "20px", transition: "all 0.3s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <h4 style={{ fontSize: "17px", fontWeight: 600, color: "white", flex: 1, marginRight: "12px", margin: 0 }}>{item.title}</h4>
        <button onClick={() => deleteItem(section, item.id)}
          style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: "8px", padding: "6px", cursor: "pointer" }}>
          <Icons.trash size={14} color="#f87171" />
        </button>
      </div>
      <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.6, marginBottom: "14px" }}>{item.desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
        {item.tags && item.tags.map((t, i) => <Badge key={i} text={t} idx={i} />)}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        {showUrl && item.url && (
          <a href={item.url} target="_blank" rel="noreferrer"
            style={{ fontSize: "12px", color: "#818cf8", background: "rgba(99,102,241,0.1)", padding: "6px 12px", borderRadius: "8px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
            <Icons.link size={12} /> Visit Site
          </a>
        )}
        {showGithub && item.github && (
          <a href={item.github} target="_blank" rel="noreferrer"
            style={{ fontSize: "12px", color: "#94a3b8", background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: "8px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
            <Icons.code size={12} /> GitHub
          </a>
        )}
      </div>
    </div>
  );

  // ─── SECTION HEADER ───
  const SectionHeader = ({ iconKey, title, subtitle, gradient, modalKey }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {Icons[iconKey] && Icons[iconKey]({ size: 20, color: "white" })}
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: 700, margin: 0 }}>{title}</h2>
        </div>
        <p style={{ color: "#64748b", marginLeft: "52px", marginTop: "4px" }}>{subtitle}</p>
      </div>
      <button onClick={() => { resetForm(); setModal(modalKey); }}
        style={{ ...S.gradBtn, padding: "10px 20px", fontSize: "14px" }}>
        <Icons.plus size={16} /> Add New
      </button>
    </div>
  );

  const EmptyState = () => (
    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "80px 0", color: "#475569" }}>
      <Icons.folder size={48} color="#475569" />
      <p style={{ marginTop: "16px" }}>No items yet. Click "Add New" to create one.</p>
    </div>
  );

  /* ════════════════════
     RENDER
  ════════════════════ */
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #1e1b4b, #0f172a)",
      color: "white",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      overflowX: "hidden",
      position: "relative",
    }}>
      {/* Background orbs */}
      <div style={{ position: "fixed", top: "-200px", left: "-200px", width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-200px", right: "-200px", width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: "16px", left: "50%", transform: "translateX(-50%)", zIndex: 40,
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px", padding: "6px", display: "flex", gap: "4px",
      }}>
        {[
          { id: "home", icon: "home", label: "Home" },
          { id: "chemistry", icon: "flask", label: "Chemistry" },
          { id: "calisthenics", icon: "dumbbell", label: "Calisthenics" },
          { id: "python", icon: "code", label: "Python" },
          { id: "websites", icon: "globe", label: "Websites" },
        ].map((n) => (
          <button key={n.id}
            onClick={() => { setTab(n.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 16px", borderRadius: "12px", border: "none",
              fontSize: "13px", fontWeight: 500, cursor: "pointer", transition: "all 0.3s",
              background: tab === n.id ? "linear-gradient(135deg, #6366f1, #06b6d4)" : "transparent",
              color: tab === n.id ? "white" : "#94a3b8",
              boxShadow: tab === n.id ? "0 4px 20px rgba(99,102,241,0.3)" : "none",
            }}>
            {Icons[n.icon] && Icons[n.icon]({ size: 16 })}
            <span>{n.label}</span>
          </button>
        ))}
      </nav>

      {/* Scroll top */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 40, padding: "12px",
            background: "#6366f1", borderRadius: "50%", border: "none", cursor: "pointer", color: "white",
            boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}>
          <Icons.arrow size={20} />
        </button>
      )}

      {/* ═══ HOME ═══ */}
      {tab === "home" && (
        <>
          <section style={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <SafeHeroCanvas />

            <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", maxWidth: "800px" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)",
                padding: "8px 20px", borderRadius: "999px", marginBottom: "24px",
                border: "1px solid rgba(255,255,255,0.1)", fontSize: "12px",
                fontWeight: 500, letterSpacing: "3px", color: "#c4b5fd",
              }}>
                <Icons.star size={14} color="#818cf8" />
                PORTFOLIO 2025
              </div>

              <h1 style={{ fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 0.95, margin: 0 }}>
                <span style={{ color: "white" }}>Creative</span><br />
                <span style={{ background: "linear-gradient(135deg, #818cf8, #06b6d4, #34d399)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Multi-Disciplinary
                </span><br />
                <span style={{ color: "white" }}>Portfolio.</span>
              </h1>

              <p style={{ fontSize: "18px", color: "#94a3b8", maxWidth: "500px", margin: "24px auto 40px", lineHeight: 1.7 }}>
                Chemistry researcher · Calisthenics athlete · Python developer · Web creator.
              </p>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => setTab("chemistry")}
                  style={{ ...S.gradBtn, padding: "14px 32px", fontSize: "15px", boxShadow: "0 4px 24px rgba(99,102,241,0.3)" }}>
                  Explore My Work <Icons.chevron size={18} />
                </button>
                <button onClick={() => setTab("websites")}
                  style={{ padding: "14px 32px", fontSize: "15px", fontWeight: 500,
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", color: "white", cursor: "pointer" }}>
                  View Websites
                </button>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section style={{ padding: "64px 24px" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
              {[
                { icon: "flask", value: totalChem, label: "Chemistry Docs", grad: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
                { icon: "dumbbell", value: calisthenicsData.length, label: "Calisthenics Skills", grad: "linear-gradient(135deg, #f43f5e, #f97316)" },
                { icon: "code", value: pythonData.length, label: "Python Projects", grad: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
                { icon: "globe", value: websitesData.length, label: "Websites Built", grad: "linear-gradient(135deg, #10b981, #14b8a6)" },
              ].map((s, i) => (
                <div key={i} style={{ ...S.glass, padding: "24px", textAlign: "center" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: s.grad,
                    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    {Icons[s.icon]({ size: 22, color: "white" })}
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: 700 }}>{s.value}</div>
                  <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Overview Cards */}
          <section style={{ padding: "32px 24px 80px" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <h2 style={{ fontSize: "32px", fontWeight: 700, textAlign: "center", marginBottom: "48px" }}>
                What I <span style={{ background: "linear-gradient(135deg, #818cf8, #06b6d4)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Do</span>
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "16px" }}>
                {[
                  { icon: "flask", title: "Chemistry", desc: "SOPs, analytical methods, instrument handling, and deep theoretical knowledge.", t: "chemistry" },
                  { icon: "dumbbell", title: "Calisthenics", desc: "Bodyweight mastery — muscle-ups, planches, handstands, and more.", t: "calisthenics" },
                  { icon: "code", title: "Python", desc: "Automation scripts, web scrapers, data analysis tools, and applications.", t: "python" },
                  { icon: "globe", title: "Web Development", desc: "Modern responsive websites with React, Tailwind, and 3D elements.", t: "websites" },
                ].map((c, i) => (
                  <div key={i} onClick={() => setTab(c.t)} style={{ ...S.glass, padding: "24px", cursor: "pointer", transition: "all 0.3s" }}>
                    {Icons[c.icon]({ size: 28, color: "#818cf8" })}
                    <h3 style={{ fontSize: "20px", fontWeight: 600, margin: "16px 0 8px" }}>{c.title}</h3>
                    <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.6, marginBottom: "16px" }}>{c.desc}</p>
                    <span style={{ color: "#818cf8", fontSize: "14px", display: "flex", alignItems: "center", gap: "4px" }}>
                      Explore <Icons.chevron size={14} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ═══ CHEMISTRY ═══ */}
      {tab === "chemistry" && (
        <section style={{ paddingTop: "96px", paddingBottom: "64px", padding: "96px 24px 64px", minHeight: "100vh" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <SectionHeader iconKey="flask" title="Chemistry"
              subtitle="SOPs, Methods, Instrument Handling & Knowledge"
              gradient="linear-gradient(135deg, #6366f1, #06b6d4)" modalKey={"chem-" + chemTab} />

            {/* Sub-tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
              {Object.entries(chemSections).map(([key, val]) => (
                <button key={key} onClick={() => setChemTab(key)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "10px 16px", borderRadius: "12px", border: "none",
                    fontSize: "13px", fontWeight: 500, cursor: "pointer",
                    background: chemTab === key ? "rgba(255,255,255,0.1)" : "transparent",
                    color: chemTab === key ? "white" : "#64748b",
                  }}>
                  {Icons[val.iconKey] && Icons[val.iconKey]({ size: 15 })}
                  {val.label}
                  <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "999px" }}>
                    {val.data.length}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
              {chemSections[chemTab].data.map((item) => (
                <ItemCard key={item.id} item={item} section={"chem-" + chemTab} />
              ))}
              {chemSections[chemTab].data.length === 0 && <EmptyState />}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CALISTHENICS ═══ */}
      {tab === "calisthenics" && (
        <section style={{ padding: "96px 24px 64px", minHeight: "100vh" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <SectionHeader iconKey="dumbbell" title="Calisthenics"
              subtitle="Skills, progressions, and bodyweight mastery"
              gradient="linear-gradient(135deg, #f43f5e, #f97316)" modalKey="calisthenics" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
              {calisthenicsData.map((item) => <ItemCard key={item.id} item={item} section="calisthenics" />)}
              {calisthenicsData.length === 0 && <EmptyState />}
            </div>
          </div>
        </section>
      )}

      {/* ═══ PYTHON ═══ */}
      {tab === "python" && (
        <section style={{ padding: "96px 24px 64px", minHeight: "100vh" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <SectionHeader iconKey="code" title="Python Projects"
              subtitle="Automation, data science, and applications"
              gradient="linear-gradient(135deg, #06b6d4, #3b82f6)" modalKey="python" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
              {pythonData.map((item) => <ItemCard key={item.id} item={item} section="python" showGithub />)}
              {pythonData.length === 0 && <EmptyState />}
            </div>
          </div>
        </section>
      )}

      {/* ═══ WEBSITES ═══ */}
      {tab === "websites" && (
        <section style={{ padding: "96px 24px 64px", minHeight: "100vh" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <SectionHeader iconKey="globe" title="Websites"
              subtitle="Live websites I have designed and built"
              gradient="linear-gradient(135deg, #10b981, #14b8a6)" modalKey="websites" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "16px" }}>
              {websitesData.map((item) => (
                <div key={item.id} style={{ ...S.glass, overflow: "hidden", transition: "all 0.3s" }}>
                  {/* Preview */}
                  <div style={{
                    height: "180px", display: "flex", alignItems: "center", justifyContent: "center",
                    background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.08))",
                    borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative",
                  }}>
                    <div style={{ textAlign: "center" }}>
                      <Icons.globe size={40} color="#818cf8" />
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "8px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.url || "No URL added"}
                      </div>
                    </div>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer"
                        style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                          background: "rgba(99,102,241,0.85)", backdropFilter: "blur(4px)",
                          opacity: 0, transition: "opacity 0.3s", textDecoration: "none", color: "white", fontWeight: 500 }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0"; }}>
                        <Icons.eye size={18} color="white" />
                        <span style={{ marginLeft: "8px" }}>Visit Live Site</span>
                      </a>
                    )}
                  </div>
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <h4 style={{ fontSize: "17px", fontWeight: 600, margin: 0 }}>{item.title}</h4>
                      <button onClick={() => deleteItem("websites", item.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                        <Icons.trash size={14} color="#f87171" />
                      </button>
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "12px" }}>{item.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {item.tags && item.tags.map((t, i) => <Badge key={i} text={t} idx={i} />)}
                    </div>
                  </div>
                </div>
              ))}
              {websitesData.length === 0 && <EmptyState />}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "48px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "12px",
          background: "linear-gradient(135deg, #6366f1, #06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <Icons.zap size={18} color="white" />
        </div>
        <div style={{ fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>
          Portfolio<span style={{ color: "#818cf8" }}>.</span>
        </div>
        <p style={{ color: "#475569", fontSize: "13px" }}>Built with React, Three.js & Love</p>
      </footer>

      {/* ═══ MODAL ═══ */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div onClick={() => { setModal(null); resetForm(); }}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
          <div style={{
            position: "relative", width: "100%", maxWidth: "480px",
            background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "24px", padding: "28px", zIndex: 10, maxHeight: "85vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 600, margin: 0 }}>
                {modal === "websites" ? "Add Website" :
                 modal === "python" ? "Add Python Project" :
                 modal === "calisthenics" ? "Add Calisthenics Skill" :
                 "Add Chemistry Item"}
              </h3>
              <button onClick={() => { setModal(null); resetForm(); }}
                style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "12px", padding: "8px", cursor: "pointer" }}>
                <Icons.x size={18} color="#94a3b8" />
              </button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter a title..." style={S.input} />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Description</label>
              <textarea rows={4} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}
                placeholder="Describe this item..." style={{ ...S.input, resize: "none" }} />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="e.g. React, HPLC, Advanced" style={S.input} />
            </div>

            {modal === "websites" && (
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Website URL</label>
                <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://your-site.com" style={S.input} />
              </div>
            )}

            {modal === "python" && (
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>GitHub URL</label>
                <input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })}
                  placeholder="https://github.com/you/repo" style={S.input} />
              </div>
            )}

            <button onClick={addItem}
              style={{ ...S.gradBtn, width: "100%", padding: "14px", fontSize: "15px", marginTop: "8px",
                opacity: form.title.trim() ? 1 : 0.4, cursor: form.title.trim() ? "pointer" : "not-allowed" }}>
              <Icons.plus size={18} /> Add to Portfolio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}