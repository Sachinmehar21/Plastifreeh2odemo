"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  useGLTF,
  PerspectiveCamera,
} from "@react-three/drei";
import { useRef, useState, useEffect } from "react";

/* ─── 3D Model ─────────────────────────────────────────── */
function WaterCarton() {
  const { scene } = useGLTF("/water.glb");
  return (
    <Float speed={1.1} rotationIntensity={0.1} floatIntensity={0.45}>
      <primitive
        object={scene}
        scale={0.9}
        position={[0, 0, 0]}
        rotation={[0, -0.25, 0]}
      />
    </Float>
  );
}

/* ─── Animated counter ──────────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        let n = 0;
        const tick = () => {
          n += to / 55;
          if (n >= to) { setVal(to); return; }
          setVal(Math.floor(n));
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Scroll reveal ─────────────────────────────────────── */
function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(26px)",
      transition: `opacity 0.85s ease ${delay}ms, transform 0.85s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── Pillars ───────────────────────────────────────────── */
const pillars = [
  {
    tag: "PURITY",
    icon: "💧",
    headline: "100% Pure Water",
    body: "Naturally filtered mountain spring water — no additives, no chlorine, no compromise. Just water at its finest.",
  },
  {
    tag: "PACKAGING",
    icon: "♻️",
    headline: "93% Recycled Carton",
    body: "Our Tetra Pak-style carton is made from 93% sustainably sourced, renewable, recycled materials.",
  },
  {
    tag: "PLANET",
    icon: "🌿",
    headline: "Zero Plastic Impact",
    body: "Every carton replaces a plastic bottle. Every purchase funds ocean plastic cleanup. Real change, one sip at a time.",
  },
];

const stats = [
  { num: 93, suffix: "%", label: "Recycled Carton" },
  { num: 100, suffix: "%", label: "Plastic Free" },
  { num: 0, suffix: "g", label: "Microplastics" },
  { num: 40, suffix: "%", label: "Lower Carbon" },
];

/* ─── Page ───────────────────────────────────────────────── */
export default function Page() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        :root{
          --ocean:   #050f1a;
          --deep:    #071525;
          --surface: #0a1e30;
          --card:    #0d2438;
          --blue1:   #1a6fa0;
          --blue2:   #2596d1;
          --aqua:    #43d4f5;
          --aqua2:   #6ee2f5;
          --teal:    #1a5c5c;
          --white:   #f0f8ff;
          --muted:   #7fb8d4;
          --serif:   'Cormorant Garamond', serif;
          --sans:    'Outfit', sans-serif;
        }
        body{
          background:var(--ocean);
          color:var(--white);
          font-family:var(--sans);
          overflow-x:hidden;
        }

        /* grain */
        body::after{
          content:'';position:fixed;inset:0;pointer-events:none;z-index:9000;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size:160px;opacity:0.3;
        }

        /* water ripple BG lines */
        .ripple-bg{
          position:absolute;inset:0;overflow:hidden;pointer-events:none;
        }
        .ripple-bg::before,.ripple-bg::after{
          content:'';position:absolute;border-radius:50%;
          border:1px solid rgba(67,212,245,0.06);
        }
        .ripple-bg::before{
          width:800px;height:800px;top:-200px;right:-200px;
          box-shadow:0 0 0 60px rgba(67,212,245,0.035),0 0 0 120px rgba(67,212,245,0.02),0 0 0 200px rgba(67,212,245,0.01);
        }
        .ripple-bg::after{
          width:600px;height:600px;bottom:-100px;left:-150px;
          box-shadow:0 0 0 60px rgba(26,111,160,0.04),0 0 0 120px rgba(26,111,160,0.02);
        }

        .btn-p{
          display:inline-flex;align-items:center;gap:8px;
          padding:14px 30px;
          background:linear-gradient(135deg,#2596d1,#43d4f5);
          color:#020d18;border:none;border-radius:100px;
          font-family:var(--sans);font-size:0.82rem;font-weight:500;
          letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;
          transition:transform .2s,box-shadow .2s;
          box-shadow:0 4px 20px rgba(67,212,245,0.25);
        }
        .btn-p:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(67,212,245,0.4)}

        .btn-g{
          display:inline-flex;align-items:center;gap:8px;
          padding:13px 26px;background:rgba(255,255,255,0.05);
          color:var(--white);border:1px solid rgba(255,255,255,0.18);
          border-radius:100px;font-family:var(--sans);font-size:0.82rem;
          letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;
          transition:border-color .2s,background .2s;
          backdrop-filter:blur(6px);
        }
        .btn-g:hover{border-color:var(--aqua);background:rgba(67,212,245,0.08);color:var(--aqua)}

        .pc{
          background:var(--card);
          border:1px solid rgba(67,212,245,0.1);
          border-radius:20px;padding:2.2rem 1.8rem;
          transition:border-color .3s,transform .3s;
        }
        .pc:hover{border-color:rgba(67,212,245,0.32);transform:translateY(-4px)}

        @keyframes fu{from{opacity:0;transform:translateY(38px)}to{opacity:1;transform:none}}
        .a1{animation:fu 1s ease 0.05s both}
        .a2{animation:fu 1s ease 0.22s both}
        .a3{animation:fu 1s ease 0.38s both}
        .a4{animation:fu 1s ease 0.54s both}
        .a5{animation:fu 1s ease 0.70s both}
        .ac{animation:fu 1.2s ease 0.12s both}

        @keyframes float-badge{
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-6px)}
        }
        .badge-float{animation:float-badge 3.5s ease-in-out infinite}
        .badge-float2{animation:float-badge 4s ease-in-out 0.8s infinite}

        .nav-link{
          font-family:var(--sans);font-size:0.75rem;letter-spacing:0.12em;
          text-transform:uppercase;color:var(--muted);text-decoration:none;
          transition:color .2s;
        }
        .nav-link:hover{color:var(--aqua)}

        /* ── responsive ── */
        .hero-inner{
          display:flex;flex-direction:column;
          align-items:center;
          padding:104px clamp(20px,5vw,64px) 60px;
          gap:0;max-width:1280px;margin:0 auto;
        }
        .hero-copy{text-align:center;max-width:520px;width:100%}
        .hero-canvas{
          width:100%;max-width:460px;
          height:clamp(360px,68vw,560px);
          position:relative;margin-top:-10px;
        }
        .stats-grid{
          display:grid;grid-template-columns:1fr 1fr;
        }
        .pillars-grid{
          display:grid;grid-template-columns:1fr;gap:1.2rem;
        }
        @media(min-width:780px){
          .hero-inner{
            flex-direction:row !important;justify-content:center;
            padding-top:120px !important;gap:clamp(2rem,5vw,5rem) !important;
          }
          .hero-copy{text-align:left !important}
          .hero-copy .ctarow{justify-content:flex-start !important}
          .hero-copy .badgerow{justify-content:flex-start !important}
          .hero-canvas{margin-top:0 !important;max-width:500px !important}
          .stats-grid{grid-template-columns:repeat(4,1fr) !important}
          .pillars-grid{grid-template-columns:repeat(3,1fr) !important}
        }
      `}</style>

      <div style={{ overflowX: "hidden" }}>

        {/* ── NAV ─────────────────────────────────────────── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(18px,4vw,40px)", height: 64,
          background: scrolled ? "rgba(5,15,26,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(67,212,245,0.07)" : "none",
          transition: "background .35s,backdrop-filter .35s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg,#2596d1,#43d4f5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.7rem", fontWeight: 600, color: "#020d18",
            }}>H₂O</div>
            <span style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", fontWeight: 400, letterSpacing: "0.03em", color: "var(--white)" }}>
              plastifree <em style={{ color: "var(--aqua)", fontStyle: "italic" }}>H₂O</em>
            </span>
          </div>

          <div style={{ display: "flex", gap: "clamp(1.2rem,3vw,2.2rem)", alignItems: "center" }}>
            {["Story", "Impact", "Shop"].map(l => (
              <a key={l} href="#" className="nav-link">{l}</a>
            ))}
          </div>

          <button className="btn-p" style={{ padding: "9px 20px", fontSize: "0.72rem" }}>Order Now</button>
        </nav>

        {/* ── HERO ────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100svh", background: `linear-gradient(160deg, #050f1a 0%, #071c30 55%, #071525 100%)`, overflow: "hidden" }}>
          <div className="ripple-bg" />

          {/* Large background water gradient sphere */}
          <div style={{
            position: "absolute", top: "50%", right: "-10%",
            transform: "translateY(-50%)",
            width: "clamp(400px,65vw,800px)", height: "clamp(400px,65vw,800px)",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at 40% 40%, rgba(37,150,209,0.12) 0%, rgba(26,111,160,0.06) 40%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div className="hero-inner">
            {/* Copy */}
            <div className="hero-copy">
              <div className="a1" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(67,212,245,0.07)",
                border: "1px solid rgba(67,212,245,0.22)",
                borderRadius: 100, padding: "6px 16px",
                fontSize: "0.68rem", letterSpacing: "0.16em",
                textTransform: "uppercase" as const, color: "var(--aqua)",
                marginBottom: "1.6rem",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--aqua)", flexShrink: 0 }} />
                Water liberated from plastic
              </div>

              <h1 className="a2" style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(3rem,10.5vw,5.8rem)",
                fontWeight: 300, lineHeight: 1.04,
                letterSpacing: "-0.01em", marginBottom: "1.4rem",
                color: "var(--white)",
              }}>
                Drink<br />
                <em style={{ color: "var(--aqua)", fontStyle: "italic" }}>Sustainably,</em><br />
                Live Responsibly.
              </h1>

              <p className="a3" style={{
                fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8,
                maxWidth: 420, margin: "0 auto 2.2rem", fontWeight: 300,
              }}>
                Pure mountain spring water in a 93% recycled carton.
                Zero plastic. Zero compromise. 100% committed to change.
              </p>

              <div className="a4 ctarow" style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" as const, justifyContent: "center", marginBottom: "1.8rem" }}>
                <button className="btn-p">Shop Now →</button>
                <button className="btn-g">Watch Film</button>
              </div>

              <div className="a5 badgerow" style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" as const, justifyContent: "center" }}>
                {["🌿 Carbon Neutral", "♻️ 93% Recycled", "💧 100% Pure"].map(b => (
                  <span key={b} style={{
                    fontSize: "0.72rem", color: "var(--muted)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 100, padding: "5px 13px",
                    background: "rgba(255,255,255,0.03)",
                  }}>{b}</span>
                ))}
              </div>
            </div>

            {/* 3D Canvas */}
            <div className="hero-canvas ac">
              {/* glow */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: 340, height: 340, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(37,150,209,0.18) 0%, rgba(67,212,245,0.06) 45%, transparent 68%)",
                pointerEvents: "none",
              }} />

              <Canvas style={{ width: "100%", height: "100%" }}>
                <PerspectiveCamera makeDefault fov={28} position={[0, 0, 8]} />
                <ambientLight intensity={1.0} />
                <directionalLight position={[4, 5, 5]} intensity={2.2} color="#ffffff" />
                <directionalLight position={[-3, 2, -3]} intensity={0.8} color="#43d4f5" />
                <pointLight position={[2, -2, 4]} intensity={0.6} color="#2596d1" />
                <pointLight position={[-2, 3, 2]} intensity={0.4} color="#ffffff" />
                <Environment preset="dawn" />
                <WaterCarton />
                <OrbitControls
                  enableZoom={false} enablePan={false}
                  autoRotate autoRotateSpeed={0.7}
                  minPolarAngle={Math.PI / 2.5}
                  maxPolarAngle={Math.PI / 1.65}
                />
              </Canvas>

              {/* Floating info chips */}
              <div className="badge-float" style={{
                position: "absolute", top: "10%", right: "0%",
                background: "rgba(7,21,37,0.9)", backdropFilter: "blur(14px)",
                border: "1px solid rgba(67,212,245,0.2)",
                borderRadius: 14, padding: "10px 16px",
              }}>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--aqua)", marginBottom: 3, fontWeight: 500 }}>Zero Plastic</div>
                <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>100% planet-friendly</div>
              </div>

              <div className="badge-float2" style={{
                position: "absolute", bottom: "22%", left: "0%",
                background: "rgba(7,21,37,0.9)", backdropFilter: "blur(14px)",
                border: "1px solid rgba(67,212,245,0.2)",
                borderRadius: 14, padding: "10px 16px",
              }}>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--aqua)", marginBottom: 3, fontWeight: 500 }}>Mountain Spring</div>
                <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>Naturally filtered</div>
              </div>
            </div>
          </div>

          {/* bottom fade */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to bottom,transparent,var(--ocean))", pointerEvents: "none" }} />

          {/* scroll cue */}
          <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(127,184,212,0.45)" }}>Scroll</span>
            <div style={{ width: 1, height: 30, background: "linear-gradient(to bottom,rgba(67,212,245,0.5),transparent)" }} />
          </div>
        </section>

        {/* ── STATS BAND ──────────────────────────────────── */}
        <section style={{ background: "var(--surface)", borderTop: "1px solid rgba(67,212,245,0.07)", borderBottom: "1px solid rgba(67,212,245,0.07)" }}>
          <div className="stats-grid" style={{ maxWidth: 900, margin: "0 auto" }}>
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 70}>
                <div style={{
                  padding: "clamp(1.8rem,5vw,2.8rem) 1.5rem",
                  borderRight: (i === 0 || i === 2) ? "1px solid rgba(67,212,245,0.07)" : "none",
                  borderBottom: i < 2 ? "1px solid rgba(67,212,245,0.07)" : "none",
                  textAlign: "center",
                }}>
                  <div style={{
                    fontFamily: "var(--serif)",
                    fontSize: "clamp(2.4rem,7vw,3.6rem)",
                    fontWeight: 300, color: "var(--aqua)", lineHeight: 1, marginBottom: "0.35rem",
                  }}>
                    <Counter to={s.num} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "var(--muted)" }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PRODUCT STORY ────────────────────────────────── */}
        <section style={{ padding: "clamp(60px,10vw,110px) clamp(20px,5vw,60px)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "60vw", height: "400px", background: "radial-gradient(ellipse, rgba(37,150,209,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Reveal>
              <p style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "var(--aqua)", marginBottom: "0.9rem", textAlign: "center" }}>Our Promise</p>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem,5.5vw,3.2rem)", fontWeight: 300, textAlign: "center", marginBottom: "clamp(2.5rem,6vw,4.5rem)", lineHeight: 1.1, color: "var(--white)" }}>
                Three pillars.{" "}
                <em style={{ color: "var(--aqua)", fontStyle: "italic" }}>One mission.</em>
              </h2>
            </Reveal>

            <div className="pillars-grid">
              {pillars.map((p, i) => (
                <Reveal key={p.tag} delay={i * 110}>
                  <div className="pc">
                    <div style={{ fontSize: "2rem", marginBottom: "1.2rem" }}>{p.icon}</div>
                    <div style={{ fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "var(--aqua)", marginBottom: "0.6rem" }}>{p.tag}</div>
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 300, color: "var(--white)", marginBottom: "0.85rem", lineHeight: 1.15 }}>{p.headline}</h3>
                    <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.75, fontWeight: 300 }}>{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TAGLINE QUOTE ────────────────────────────────── */}
        <section style={{
          background: "var(--card)",
          borderTop: "1px solid rgba(67,212,245,0.07)",
          borderBottom: "1px solid rgba(67,212,245,0.07)",
          padding: "clamp(60px,10vw,90px) clamp(20px,5vw,60px)",
          position: "relative", overflow: "hidden",
        }}>
          {/* decorative line accent */}
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 1, height: "100%", background: "linear-gradient(to bottom,transparent,rgba(67,212,245,0.1),transparent)", pointerEvents: "none" }} />
          <Reveal>
            <blockquote style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", color: "rgba(67,212,245,0.15)", fontFamily: "var(--serif)", lineHeight: 1, marginBottom: "1rem" }}>"</div>
              <p style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(1.5rem,4.2vw,2.5rem)",
                fontWeight: 300, fontStyle: "italic",
                color: "var(--white)", lineHeight: 1.3, marginBottom: "1.8rem",
              }}>
                93% there. 100% committed to change.
              </p>
              <cite style={{ fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "var(--aqua)", fontStyle: "normal" }}>
                — plastifree H₂O, Founding Principle
              </cite>
            </blockquote>
          </Reveal>
        </section>

        {/* ── CTA ─────────────────────────────────────────── */}
        <section style={{ padding: "clamp(80px,12vw,130px) clamp(20px,5vw,60px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "50vw", height: "50vw", maxWidth: 500, maxHeight: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,150,209,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
          <Reveal>
            <p style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "var(--aqua)", marginBottom: "1.4rem" }}>
              Join the movement
            </p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2.2rem,6.5vw,4rem)", fontWeight: 300, marginBottom: "1.4rem", lineHeight: 1.08, color: "var(--white)" }}>
              Drink pure.<br />
              <em style={{ color: "var(--aqua)", fontStyle: "italic" }}>Live plastic-free.</em>
            </h2>
            <p style={{ fontSize: "0.94rem", color: "var(--muted)", margin: "0 auto 2.8rem", maxWidth: 380, lineHeight: 1.78, fontWeight: 300 }}>
              Every carton purchased removes plastic from our oceans.
              Be part of India's water revolution.
            </p>
            <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" as const }}>
              <button className="btn-p" style={{ fontSize: "0.85rem", padding: "15px 34px" }}>Shop Now →</button>
              <button className="btn-g" style={{ fontSize: "0.85rem", padding: "14px 34px" }}>Follow Us</button>
            </div>
          </Reveal>
        </section>

        {/* ── FOOTER ──────────────────────────────────────── */}
        <footer style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "2rem clamp(18px,4vw,40px)",
          display: "flex", flexWrap: "wrap" as const,
          alignItems: "center", justifyContent: "space-between", gap: "1rem",
          background: "var(--deep)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#2596d1,#43d4f5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.58rem", fontWeight: 600, color: "#020d18" }}>H₂O</div>
            <span style={{ fontFamily: "var(--serif)", fontSize: "0.9rem", color: "var(--muted)" }}>plastifree <em style={{ color: "var(--aqua)" }}>H₂O</em></span>
          </div>
          <span style={{ fontSize: "0.65rem", color: "rgba(127,184,212,0.35)", letterSpacing: "0.06em" }}>© 2025 · Drink Sustainably, Live Responsibly</span>
          <div style={{ display: "flex", gap: "1.4rem" }}>
            {["Privacy", "Terms", "Instagram"].map(l => (
              <a key={l} href={l === "Instagram" ? "https://www.instagram.com/plastifreeindia/" : "#"}
                target={l === "Instagram" ? "_blank" : undefined}
                style={{ fontSize: "0.65rem", color: "var(--muted)", textDecoration: "none", letterSpacing: "0.06em" }}>{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}