const links = [
  { label: "GitHub", url: "https://github.com/itisrudraa", icon: "⌥" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/itisrudra/", icon: "in" },
];

const tips = ["Review within 24h of solving", "Snooze hard problems by +3d", "Aim for 0 due by end of day"];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#1a1a2e] bg-releet-header py-7 pb-6">
      <div className="mx-auto w-full max-w-[860px] px-9">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2"><span className="inline-block h-[7px] w-[7px] rounded-full bg-amber-400" /><strong className="font-mono text-sm text-slate-200">ReLeet</strong></div>
            <p className="font-mono text-xs leading-[1.6] text-[#6b7280]">Track, review, and retain coding interview problems.<br />Built for long-term mastery.</p>
          </div>
          <div className="flex flex-col gap-2"><span className="font-mono text-[11px] tracking-[0.08em] text-[#6b7280]">CONNECT</span>{links.map((link) => <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="font-mono text-xs text-[#6b7280] no-underline hover:text-slate-200"><span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded bg-[#1a1a2e] text-[#ffa116]">{link.icon}</span>{link.label}</a>)}</div>
          <div className="flex flex-col gap-1.5"><span className="font-mono text-[11px] tracking-[0.08em] text-[#6b7280]">PRO TIPS</span>{tips.map((tip) => <span key={tip} className="font-mono text-[11px] text-[#6b7280]"><span className="mr-1.5 text-amber-400">›</span>{tip}</span>)}</div>
        </div>
        <div className="mb-4 h-px bg-[#1a1a2e]" />
        <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-mono text-[11px] text-[#6b7280]">Made with <span className="text-red-400">♥</span> by <a href="https://github.com/itisrudraa" target="_blank" rel="noreferrer" className="font-bold text-[#ffa116] no-underline">Rudra</a></span><span className="font-mono text-[11px] text-[#6b7280]">ReLeet v1.0 · Chrome Extension</span></div>
      </div>
    </footer>
  );
}
