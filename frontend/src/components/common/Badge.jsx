const styles = {
  neutral: "bg-slate-900/5 text-slate-700 ring-slate-900/10",
  accent: "bg-orange-500/10 text-orange-700 ring-orange-500/15",
  success: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/15",
  teal: "bg-teal-500/10 text-teal-700 ring-teal-500/15",
  high: "bg-rose-500/10 text-rose-700 ring-rose-500/15",
  medium: "bg-amber-500/10 text-amber-700 ring-amber-500/15",
  low: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/15",
};

export default function Badge({ children, tone = "neutral" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ring-1 ${styles[tone] || styles.neutral}`}
    >
      {children}
    </span>
  );
}
