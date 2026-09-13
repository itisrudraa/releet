type Props = {
  label: string;
  value: number;
  accent: string;
  bg: string;
  topBorder: string;
};

export default function StatCard({ label, value, accent, bg, topBorder }: Props) {
  return (
    <div
      className="flex flex-1 flex-col gap-1.5 rounded-[10px] border border-white/5 px-[18px] pb-3.5 pt-4"
      style={{ background: bg, borderTop: `2px solid ${topBorder}CC` }}
    >
      <span
        className="font-mono text-[26px] font-bold leading-none tracking-[-0.04em]"
        style={{ color: accent }}
      >
        {value}
      </span>
      <span
        className="font-mono text-[11px] uppercase tracking-[0.09em]"
        style={{ color: `${accent}70` }}
      >
        {label}
      </span>
    </div>
  );
}
