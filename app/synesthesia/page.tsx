"use client";

import { useEffect, useRef, useState } from "react";

type Star = { id: number; x: number; y: number; found: boolean };

const initialStars: Star[] = [
  { id: 1, x: 13, y: 24, found: false }, { id: 2, x: 78, y: 18, found: false },
  { id: 3, x: 25, y: 57, found: false }, { id: 4, x: 83, y: 65, found: false },
  { id: 5, x: 52, y: 82, found: false },
];

export default function Synesthesia() {
  const [stage, setStage] = useState<"stars"|"cake"|"message">("stars");
  const [stars, setStars] = useState(initialStars);
  const [dragging, setDragging] = useState<number|null>(null);
  const [cut, setCut] = useState(false);
  const [fireworks, setFireworks] = useState(false);
  const [show27, setShow27] = useState(false);
  const [settled27, setSettled27] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const audio = useRef<AudioContext|null>(null);
  const cakeRef = useRef<HTMLDivElement>(null);
  const cutStart = useRef<{x:number;y:number}|null>(null);
  const allFound = stars.every(s => s.found);

  const play = (freq=523, duration=.5) => {
    try {
      const Ctx = window.AudioContext;
      if (!audio.current) audio.current = new Ctx();
      const ctx = audio.current;
      if (ctx.state === "suspended") void ctx.resume();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(.12, ctx.currentTime+.035);
      g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime+duration);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+duration+.02);
      setSoundOn(true);
    } catch {}
  };

  useEffect(() => {
    if (allFound && stage === "stars") {
      const t = window.setTimeout(() => { setStage("cake"); play(659,.7); }, 650);
      return () => window.clearTimeout(t);
    }
  }, [allFound, stage]);

  useEffect(() => {
    if (stage === "message") {
      const a = window.setTimeout(() => setFireworks(true), 350);
      const b = window.setTimeout(() => setShow27(true), 1900);
      const c = window.setTimeout(() => setSettled27(true), 3300);
      return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
    }
  }, [stage]);

  const moveStar = (id:number, e:React.PointerEvent<HTMLButtonElement>) => {
    if (dragging !== id) return;
    const rect = e.currentTarget.parentElement!.getBoundingClientRect();
    const x = Math.max(5,Math.min(95,((e.clientX-rect.left)/rect.width)*100));
    const y = Math.max(7,Math.min(92,((e.clientY-rect.top)/rect.height)*100));
    const nearCenter = Math.hypot(x-50,y-49) < 18;
    setStars(prev => prev.map(s => s.id===id ? {...s,x,y,found:s.found||nearCenter} : s));
    if (nearCenter) { setDragging(null); play(740,.22); }
  };

  const beginCut = (e:React.PointerEvent<HTMLDivElement>) => {
    cutStart.current = {x:e.clientX,y:e.clientY};
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const finishCut = (e:React.PointerEvent<HTMLDivElement>) => {
    if (!cutStart.current || cut) return;
    const dx = Math.abs(e.clientX-cutStart.current.x), dy = Math.abs(e.clientY-cutStart.current.y);
    if (dx > 45 || dy > 45) {
      setCut(true); play(880,.7);
      window.setTimeout(() => setStage("message"), 1050);
    }
    cutStart.current = null;
  };

  useEffect(() => () => { if(audio.current) void audio.current.close(); }, []);

  return (
    <main className={`universe stage-${stage}`}>
      <div className="nebula n1"/><div className="nebula n2"/><div className="starfield"/>
      {stage === "stars" && <>
        <header className="intro">
          <span className="eyebrow">A LITTLE COSMIC QUEST</span>
          <h1>Gather the <em>starlight</em></h1>
          <p>Move each wandering star into the glowing centre.<br/>Something sweet is waiting for you.</p>
          <div className="counter">{stars.filter(s=>s.found).length} <i>/</i> 5 STARS FOUND</div>
        </header>
        <div className="star-playfield">
          <div className="destination"><span>✧</span></div>
          {stars.map(s => !s.found && <button key={s.id} className="draggable-star" style={{left:`${s.x}%`,top:`${s.y}%`}} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);setDragging(s.id);play(440,.15);}} onPointerMove={e=>moveStar(s.id,e)} onPointerUp={()=>setDragging(null)} aria-label="Move star">✦</button>)}
          {stars.filter(s=>s.found).map(s=><span key={s.id} className="collected" style={{left:`${50+(s.id-3)*2}%`,top:`${49+(s.id%2)*2}%`}}>✦</span>)}
        </div>
        <p className="hint">TOUCH A STAR · DRAG IT TO THE CENTRE</p>
      </>}

      {stage === "cake" && <section className="cake-stage">
        <span className="eyebrow">YOU FOUND A LITTLE SOMETHING</span>
        <h1>A cake, made of <em>stardust</em></h1>
        <p>Every birthday deserves a wish.<br/>Make the first cut to see yours.</p>
        <div ref={cakeRef} className={`cake-scene ${cut?"cake-cut":""}`} onPointerDown={beginCut} onPointerUp={finishCut} onPointerCancel={()=>cutStart.current=null}>
          <div className="cake-glow"/>
          <div className="cake">
            <div className="candles"><i/><i/><i/></div>
            <div className="flames"><b>✦</b><b>✦</b><b>✦</b></div>
            <div className="icing"><span>✧</span><span>♡</span><span>✧</span></div>
            <div className="cake-top"/>
            <div className="cake-body"><span>FOR YOU</span></div>
            <div className="cake-base"/>
          </div>
          {cut && <div className="knife-swipe">✧</div>}
        </div>
        <p className="hint">{cut ? "A WISH IS ON ITS WAY…" : "SWIPE YOUR FINGER ACROSS THE CAKE TO CUT IT"}</p>
      </section>}

      {stage === "message" && <section className="reveal-stage">
        <div className="birthday-copy">
          <span className="eyebrow">23 · 11 · 2026</span>
          <div className="ornament">✧ ✦ ✧</div>
          <h1>Happy<br/><em>{settled27 && <span className="age-inline">27</span>}th Birthday</em></h1>
          <h2>Chai Paglu Didi</h2>
          <p>In this enormous universe, among billions of stars, I&apos;m grateful that I got you as my sister.<br/><br/>No matter where life takes us, you&apos;ll always have me.</p>
          <span className="signature">WITH LOVE, YOUR LITTLE BROTHER</span>
        </div>
        {fireworks && <div className="celebration" aria-hidden="true">
          {Array.from({length:24},(_,i)=><i key={i} className={`burst b${i%6}`} style={{left:`${(i*37)%100}%`,top:`${(i*19)%65}%`,animationDelay:`${(i%7)*.12}s`}}>✦</i>)}
          {Array.from({length:9},(_,i)=><i key={`p${i}`} className={`balloon balloon-${i%5}`} style={{left:`${(i*13)%94+2}%`,animationDelay:`${(i%5)*.25}s`}}/>)}
          <div className="firework-label">✦  ✧  ✦</div>
        </div>}
        {show27 && !settled27 && <div className="age-number">27</div>}
      </section>}
      {!soundOn && <button className="sound-toggle" onClick={()=>play(523,.35)} aria-label="Enable sound">♫ SOUND</button>}
    </main>
  );
}
