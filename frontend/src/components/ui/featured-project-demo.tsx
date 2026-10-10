"use client";

import * as React from "react";
import { X } from "lucide-react";
import FeaturedProjectHero, { type FeaturedProject } from "./featured-project-hero";

const settings = {
  title: "Detect Financial Anomalies in Seconds.",
  description: "Protect your investments using our advanced Beneish M-Score engine. FinOmaly analyzes corporate statements and instantly flags hidden manipulation risks.",
  eyebrow: "FINANCIAL FRAUD DETECTION / CORE FEATURES",
  projectCount: 3,
  showServices: true,
  showOutcome: true,
};

const demoStyles = `
.fph-demo {width:100%;max-width:1000px;margin:0 auto;padding:clamp(20px,4vw,44px);box-sizing:border-box;font-family:inherit}
.fph-demo *, .fph-demo__dialog * {box-sizing:border-box}
.fph-demo__note {margin:24px 0 0;padding-top:16px;border-top-width:1px;font-size:10px;line-height:1.7}
.fph-demo__visual {position:relative;display:flex;flex-direction:column;justify-content:center;width:100%;height:100%;padding:clamp(20px,3cqw,30px);overflow:hidden;background:linear-gradient(145deg,color-mix(in srgb,currentColor 4%,transparent),transparent 75%)}
.fph-demo__visual::before {content:"";position:absolute;width:220px;height:220px;border:1px solid currentColor;border-radius:50%;opacity:.04;left:-90px;top:-110px;pointer-events:none}
.fph-demo__visual-label {display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:18px;font-size:9px;letter-spacing:.08em;text-transform:uppercase}
.fph-demo__visual-label strong {font-size:11px;font-weight:600;letter-spacing:-.025em;text-transform:none}
.fph-demo__window {position:relative;min-width:0;width:100%;border:1px solid;border-color:inherit;border-radius:12px;overflow:hidden;box-shadow:0 16px 32px -20px color-mix(in srgb,currentColor 20%,transparent);transform:rotate(-2deg)}
.fph-demo__window-head {display:flex;align-items:center;gap:4px;height:29px;padding:0 11px;border-bottom-width:1px}
.fph-demo__dot {width:4px;height:4px;border-radius:50%;background:currentColor;opacity:.25}
.fph-demo__window-head span:last-child {margin-left:auto;font-size:7px;letter-spacing:.015em}
.fph-demo__product {display:grid;grid-template-columns:68px 1fr;min-height:198px}
.fph-demo__sidebar {border-right-width:1px;padding:13px 9px;font-size:7px;line-height:1.4}
.fph-demo__brand {display:block;margin-bottom:17px;font-size:9px;font-weight:650;letter-spacing:-.025em}
.fph-demo__nav {display:block;margin-top:8px;padding:5px 4px;border-radius:4px;white-space:nowrap}
.fph-demo__screen {min-width:0;padding:14px 12px}
.fph-demo__screen-title {display:block;font-size:11px;font-weight:550;letter-spacing:-.025em}
.fph-demo__screen-sub {display:block;margin-top:4px;font-size:7px;line-height:1.5}
.fph-demo__metric {margin-top:16px;padding:10px;border:1px solid;border-color:inherit;border-radius:7px}
.fph-demo__metric-head {display:flex;align-items:center;justify-content:space-between;font-size:7px}
.fph-demo__bars {display:flex;align-items:end;gap:5px;height:56px;margin-top:10px}
.fph-demo__bar {flex:1;min-width:0;border-radius:3px 3px 1px 1px}
.fph-demo__release {display:flex;align-items:center;justify-content:space-between;gap:5px;margin-top:11px;padding-top:9px;border-top-width:1px;font-size:7px}
.fph-demo__status {display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
.fph-demo__status::before {content:"";width:3px;height:3px;background:currentColor;border-radius:50%}
.fph-demo__folio {padding:18px;min-height:224px}
.fph-demo__folio-top {display:flex;justify-content:space-between;align-items:center;font-size:7px}
.fph-demo__folio-title {margin:19px 0 12px;font-size:23px;font-weight:500;line-height:1.03;letter-spacing:-.06em;max-width:9ch}
.fph-demo__gallery {display:grid;grid-template-columns:1fr 1fr;gap:8px}
.fph-demo__art {height:65px;border-radius:5px;overflow:hidden;position:relative;background:color-mix(in srgb,currentColor 8%,transparent)}
.fph-demo__art:first-child::before {content:"";position:absolute;inset:16px 22px;border-radius:50%;border:10px solid currentColor;opacity:.65;transform:rotate(-30deg)}
.fph-demo__art:last-child::before {content:"";position:absolute;inset:12px 23px;background:currentColor;opacity:.2;transform:rotate(-25deg);border-radius:2px}
.fph-demo__art-label {display:flex;justify-content:space-between;margin-top:6px;font-size:6px}
.fph-demo__relay {padding:17px 12px;min-height:224px}
.fph-demo__board {display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:17px}
.fph-demo__column-label {font-size:6px;display:flex;justify-content:space-between;padding:0 2px 7px;white-space:nowrap}
.fph-demo__task {min-height:45px;margin-bottom:6px;border:1px solid;border-color:inherit;border-radius:5px;padding:7px 6px}
.fph-demo__task-label {display:block;font-size:6px;line-height:1.45}
.fph-demo__task-line {height:2px;width:70%;background:currentColor;opacity:.12;border-radius:2px;margin-top:8px}
.fph-demo__task-dot {display:block;width:7px;height:7px;border-radius:50%;margin-top:7px;background:currentColor;opacity:.22}
.fph-demo__visual-footer {display:flex;align-items:center;justify-content:space-between;margin-top:19px;font-size:7px;letter-spacing:.06em;text-transform:uppercase}
.fph-demo__dialog {width:min(660px,calc(100vw - 32px));max-height:calc(100dvh - 40px);margin:auto;padding:0;border:1px solid;border-color:var(--color-border,currentColor);border-radius:22px;overflow:auto;font-family:inherit;box-shadow:0 24px 80px #0003}
.fph-demo__dialog::backdrop {background:#0008}
.fph-demo__dialog-body {padding:clamp(24px,6vw,42px)}
.fph-demo__dialog-top {display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:25px;font-size:10px;letter-spacing:.08em;text-transform:uppercase}
.fph-demo__close {display:grid;place-items:center;width:36px;height:36px;border:1px solid;border-color:inherit;border-radius:50%;background:transparent;color:inherit;cursor:pointer}
.fph-demo__close:focus-visible {outline:2px solid var(--color-ring,currentColor);outline-offset:3px}
.fph-demo__dialog h2 {margin:0 0 13px;font-size:34px;font-weight:550;letter-spacing:-.05em;line-height:1.1}
.fph-demo__dialog-summary {margin:0;font-size:14px;line-height:1.8}
.fph-demo__case-section {margin-top:27px;padding-top:22px;border-top-width:1px}
.fph-demo__case-section h3 {margin:0 0 8px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;font-weight:550}
.fph-demo__case-section p {margin:0;font-size:13px;line-height:1.8}
@media (prefers-reduced-motion:reduce) {.fph-demo__window{transform:none}}
`;

function ProductPreview({ kind, name }: { kind: "north" | "folio" | "relay"; name: string }) {
  return <div className="fph-demo__visual bg-muted/40 text-foreground">
    <div className="fph-demo__visual-label text-muted-foreground"><strong className="text-foreground">{name}</strong><span>Concept / 0{kind === "north" ? 1 : kind === "folio" ? 2 : 3}</span></div>
    <div className="fph-demo__window border-border bg-card text-card-foreground">
      <div className="fph-demo__window-head border-border"><i className="fph-demo__dot" /><i className="fph-demo__dot" /><i className="fph-demo__dot" /><span className="text-muted-foreground">{name.toLowerCase()} — workspace</span></div>
      {kind === "north" ? <div className="fph-demo__product">
        <div className="fph-demo__sidebar border-border text-muted-foreground"><span className="fph-demo__brand text-foreground">n / northstar</span><span className="fph-demo__nav bg-muted text-foreground">Overview</span><span className="fph-demo__nav">Deployments</span><span className="fph-demo__nav">Activity</span><span className="fph-demo__nav">Settings</span></div>
        <div className="fph-demo__screen"><strong className="fph-demo__screen-title">Ready for what’s next.</strong><span className="fph-demo__screen-sub text-muted-foreground">A clear view of every release.</span><div className="fph-demo__metric border-border"><div className="fph-demo__metric-head text-muted-foreground"><span>Deployment activity</span><span>7 days</span></div><div className="fph-demo__bars">{[32, 49, 37, 60, 48, 72, 62, 88].map((height, index) => <span key={index} className="fph-demo__bar bg-primary" style={{ height: `${height}%`, opacity: index === 7 ? .9 : .12 + index * .06 }} />)}</div></div><div className="fph-demo__release border-border text-muted-foreground"><span>Production / main</span><span className="fph-demo__status text-foreground">Ready</span></div></div>
      </div> : kind === "folio" ? <div className="fph-demo__folio"><div className="fph-demo__folio-top"><strong>Folio studio</strong><span className="text-muted-foreground">Work / About / Contact</span></div><div className="fph-demo__folio-title">Make room<br />for the work.</div><div className="fph-demo__gallery"><div><div className="fph-demo__art" /><div className="fph-demo__art-label text-muted-foreground"><span>Form & function</span><span>01</span></div></div><div><div className="fph-demo__art" /><div className="fph-demo__art-label text-muted-foreground"><span>A different perspective</span><span>02</span></div></div></div></div> : <div className="fph-demo__relay"><strong className="fph-demo__screen-title">A little more clarity.</strong><span className="fph-demo__screen-sub text-muted-foreground">Product workspace / This week</span><div className="fph-demo__board">{["Planned", "In progress", "Complete"].map((column, index) => <div key={column}><div className="fph-demo__column-label text-muted-foreground"><span>{column}</span><span>02</span></div>{[0, 1].map(row => <div key={row} className="fph-demo__task border-border bg-muted/20"><span className="fph-demo__task-label">{[["Release brief", "Content audit"], ["Design review", "Build handoff"], ["Team kickoff", "Scope agreed"]][index]?.[row]}</span><div className="fph-demo__task-line" /><span className="fph-demo__task-dot" /></div>)}</div>)}</div></div>}
    </div>
    <div className="fph-demo__visual-footer text-muted-foreground"><span>Designed with intention</span><span>↗ {kind === "relay" ? "2025" : "2026"}</span></div>
  </div>;
}

const projects: readonly FeaturedProject[] = [
  { id: "analysis", name: "Data Analysis", category: "Core Engine", year: "2026", summary: "Instant processing of financial statements using robust parsing algorithms.", services: ["CSV Parsing", "Real-time Metrics", "Data Integrity"], outcome: "Accurate financial data extraction in milliseconds.", visual: <div className="fph-demo__visual bg-muted/40 text-foreground" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800')", backgroundSize: 'cover', backgroundPosition: 'center' }} />, visualDescription: "Data Analysis: charts and financial metrics dashboard." },
  { id: "beneish", name: "Beneish M-Score", category: "Fraud Detection", year: "2026", summary: "An 8-variable model that detects earnings manipulation and flags potential fraud.", services: ["Risk Assessment", "M-Score Calculation", "Anomalies"], outcome: "A clear manipulation probability score.", visual: <div className="fph-demo__visual bg-muted/40 text-foreground" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&q=80&w=800')", backgroundSize: 'cover', backgroundPosition: 'center' }} />, visualDescription: "Beneish M-Score: algorithms detecting anomalies." },
  { id: "security", name: "Secure Workspaces", category: "Infrastructure", year: "2026", summary: "Enterprise-grade security ensuring your corporate data is encrypted and isolated.", services: ["End-to-end Encryption", "Isolated DBs", "Access Control"], outcome: "Complete data privacy and protection.", visual: <div className="fph-demo__visual bg-muted/40 text-foreground" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800')", backgroundSize: 'cover', backgroundPosition: 'center' }} />, visualDescription: "Secure Workspaces: lock and data security visual." },
];

const caseNotes: Record<string, { challenge: string; approach: string }> = {
  analysis: { challenge: "Extracting insights from dense corporate statements manually is slow and error-prone.", approach: "Instantly parse CSV statements using FinOmaly's robust engine, turning unstructured numbers into actionable metrics in real time." },
  beneish: { challenge: "Spotting subtle earnings manipulation without advanced models often leaves investors exposed.", approach: "Calculate the 8-variable Beneish M-Score automatically to flag potential fraud and anomalous reporting before it's too late." },
  security: { challenge: "Financial data is highly sensitive, requiring strict privacy and protection from external threats.", approach: "Utilize isolated, encrypted workspaces where user data remains strictly private with stringent access controls." },
};

export default function FeaturedProjectHeroDemo(props: any = {}) {
  const config = { ...settings, ...props };
  const visibleProjects = projects.slice(0, Math.max(0, Math.min(projects.length, Math.round(config.projectCount))));
  const [openProjectId, setOpenProjectId] = React.useState<string | null>(null);
  const dialog = React.useRef<HTMLDialogElement>(null);
  const openProject = projects.find(project => project.id === openProjectId);

  React.useEffect(() => {
    if (openProject && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [openProject]);

  return <main className="fph-demo bg-transparent text-foreground">
    <style>{demoStyles}</style>
    <FeaturedProjectHero title={config.title} description={config.description} eyebrow={config.eyebrow} projects={visibleProjects} showServices={config.showServices} showOutcome={config.showOutcome} onOpenProject={setOpenProjectId} actionLabel="Explore feature" />
    {openProject && <dialog ref={dialog} className="fph-demo__dialog bg-card text-card-foreground" aria-labelledby="fph-case-title" aria-describedby="fph-case-summary" onClose={() => setOpenProjectId(null)}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
      }}>
      <div className="fph-demo__dialog-body">
        <div className="fph-demo__dialog-top text-muted-foreground"><span>Feature detail / {openProject.year}</span><button type="button" className="fph-demo__close border-border" aria-label="Close feature detail" onClick={() => dialog.current?.close()} autoFocus><X width="15" height="15" strokeWidth="1.4" aria-hidden="true" /></button></div>
        <h2 id="fph-case-title">{openProject.name}</h2><p id="fph-case-summary" className="fph-demo__dialog-summary text-muted-foreground">{openProject.summary}</p>
        <div className="fph-demo__case-section border-border"><h3>The challenge</h3><p className="text-muted-foreground">{caseNotes[openProject.id]!.challenge}</p></div>
        <div className="fph-demo__case-section border-border"><h3>The approach</h3><p className="text-muted-foreground">{caseNotes[openProject.id]!.approach}</p></div>
        <div className="fph-demo__case-section border-border"><h3>The direction</h3><p>{openProject.outcome}</p></div>
      </div>
    </dialog>}
  </main>;
}
