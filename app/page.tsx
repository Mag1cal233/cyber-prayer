'use client';
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from 'react';

type RiteId = 'hair' | 'merit' | 'gpa' | 'gold' | 'runner';
type Scores = Record<RiteId, number>;
type Notice = { id: number; text: string; rite: RiteId };
const empty: Scores = { hair: 0, merit: 0, gpa: 0, gold: 0, runner: 0 };

const rites = [
  { id: 'hair' as const, no: '01', name: '画技增强洗发水', hint: '从发根补充透视知识', action: '挤一下', result: '画技 +1' },
  { id: 'merit' as const, no: '02', name: '赛博木鱼', hint: '电子功德，童叟无欺', action: '敲一下', result: '功德 +1' },
  { id: 'gpa' as const, no: '03', name: '记忆饼干', hint: '知识点已进入消化道', action: '吃一口', result: 'GPA +1' },
  { id: 'gold' as const, no: '04', name: '摸金符', hint: '本局摸金，宜出大金', action: '烧一张', result: '怪物 −1 · 金光 +1' },
  { id: 'runner' as const, no: '05', name: '橄榄球', hint: '前锋已接单，即刻冲刺', action: '撞一下', result: '私募狗峰 −1' },
];

function playSound(id: RiteId, muted: boolean) {
  if (muted) return;
  const AC = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  const ctx = new AC();
  const tone = (hz: number, duration: number, type: OscillatorType, at = 0, volume = .14) => {
    const osc = ctx.createOscillator(); const gain = ctx.createGain(); const start = ctx.currentTime + at;
    osc.type = type; osc.frequency.setValueAtTime(hz, start); osc.frequency.exponentialRampToValueAtTime(Math.max(50, hz * .55), start + duration);
    gain.gain.setValueAtTime(volume, start); gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    osc.connect(gain).connect(ctx.destination); osc.start(start); osc.stop(start + duration);
  };
  const sounds: Record<RiteId, Array<[number, number, OscillatorType, number?, number?]>> = {
    hair: [[960,.08,'sine'],[1320,.1,'sine',.08,.08],[720,.12,'triangle',.16,.08]],
    merit: [[430,.08,'sine',0,.25],[180,.48,'sine',.03,.28]],
    gpa: [[175,.04,'square'],[110,.05,'square',.05],[840,.12,'sine',.12,.08]],
    gold: [[95,.5,'sawtooth',0,.07],[740,.4,'sine',.12],[1110,.34,'sine',.2,.08]],
    runner: [[125,.1,'square'],[72,.25,'sawtooth',.08,.1],[470,.08,'triangle',.22,.08]],
  };
  sounds[id].forEach(args => tone(...args)); setTimeout(() => void ctx.close(), 850);
}

function ObjectArt({ id, active }: { id: RiteId; active: boolean }) {
  if (id === 'hair') return <div className={`art shampoo ${active ? 'active' : ''}`} aria-hidden="true"><i className="cap"/><i className="bottle"><b>ART</b><span>+1</span></i><i className="bubble one"/><i className="bubble two"/><i className="bubble three"/></div>;
  if (id === 'merit') return <div className={`art fish ${active ? 'active' : ''}`} aria-hidden="true"><i className="mallet"/><i className="wood"><b>功</b></i></div>;
  if (id === 'gpa') return <div className={`art memory ${active ? 'active' : ''}`} aria-hidden="true"><i className="cookie"><b/><b/><b/><b/></i><i className="bite"/></div>;
  if (id === 'gold') return <div className={`art charm ${active ? 'active' : ''}`} aria-hidden="true"><i className="fire outer"/><i className="fire inner"/><i className="paper"><b>摸<br/>金</b></i></div>;
  return <div className={`art rugby ${active ? 'active' : ''}`} aria-hidden="true"><i className="ball"><b/><span/></i><i className="speed a"/><i className="speed b"/></div>;
}

export default function Home() {
  const [scores, setScores] = useState<Scores>(() => {
    if (typeof window === 'undefined') return empty;
    try { const saved = localStorage.getItem('cyber-prayer'); return saved ? { ...empty, ...JSON.parse(saved) } : empty; } catch { return empty; }
  });
  const [active, setActive] = useState<RiteId | null>(null);
  const [message, setMessage] = useState('请选择今日祈福项目');
  const [muted, setMuted] = useState(false);
  const [run, setRun] = useState(0);
  const [notices, setNotices] = useState<Notice[]>([]);
  const noticeId = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const invoke = (id: RiteId, result: string) => {
    playSound(id, muted);
    setScores(previous => { const next = { ...previous, [id]: previous[id] + 1 }; try { localStorage.setItem('cyber-prayer', JSON.stringify(next)); } catch {} return next; });
    setActive(id); setMessage(result); if (id === 'runner') setRun(n => n + 1);
    const nextNotice = ++noticeId.current;
    setNotices(items => [...items, { id: nextNotice, text: result, rite: id }]);
    setTimeout(() => setNotices(items => items.filter(item => item.id !== nextNotice)), 980);
    if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setActive(null), 720);
  };
  const total = Object.values(scores).reduce((sum, value) => sum + value, 0);

  return <main className="shell">
    <div className="scan" aria-hidden="true"/>
    <header className="bar">
      <a href="#altar" className="logo"><strong>赛博祈福</strong><span>管理局</span></a>
      <p className="online"><i/>香火服务器正常</p>
      <button className="sound" onClick={() => setMuted(v => !v)} aria-pressed={muted}>音效：{muted ? '关' : '开'}</button>
    </header>

    <section className="hero">
      <div><p className="eyebrow">民间玄学数字化工程 · V5.1.0</p><h1>今日不靠运气<br/><span>靠点击。</span></h1></div>
      <div className="total"><span>累计显灵</span><strong>{String(total).padStart(4,'0')}</strong><small>次</small></div>
    </section>

    <section className="altar" id="altar" aria-label="祈福项目">
      <div className="oracle-row"><p>把不切实际的愿望<br/>交给不负责任的科技</p><div className={`oracle ${active ? 'talking' : ''}`} role="status" aria-live="polite">{message}</div></div>
      <div className="grid">
        {rites.map(rite => <article className={`rite ${active === rite.id ? 'active' : ''}`} key={rite.id}>
          <div className="meta"><span>RX-{rite.no}</span><b>{String(scores[rite.id]).padStart(2,'0')}</b></div>
          <ObjectArt id={rite.id} active={active === rite.id}/>
          <div className="copy"><h2>{rite.name}</h2><p>{rite.hint}</p></div>
          <button onClick={() => invoke(rite.id, rite.result)}><span>{rite.action}</span><b>{rite.result}</b></button>
          {active === rite.id && <div className="burst" aria-hidden="true"><i>+</i><i>✦</i><i>1</i><i>吉</i></div>}
        </article>)}
      </div>
    </section>

    {run > 0 && <div className="runway" key={run} aria-hidden="true"><div className="forward"><img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/forward.png`} alt=""/><b>私募狗峰 −1</b></div></div>}
    <div className="pop-stack" aria-live="polite" aria-atomic="false">
      {notices.map((notice, index) => <div className={`click-pop pop-${notice.rite}`} style={{ '--pop-index': index } as React.CSSProperties} key={notice.id}><span>{notice.text}</span><b>祈福已受理</b></div>)}
    </div>
    <footer><p>本系统不保证愿望实现，只保证数字增加。</p><span>非商业同人作品 · 角色版权归原权利人所有</span></footer>
  </main>;
}
