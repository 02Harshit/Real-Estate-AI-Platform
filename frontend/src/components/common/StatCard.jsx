export default function StatCard({ label, value, detail }) {
  return (
    <div className="surface-card rounded-[1.75rem] p-6">
      <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-black text-slate-950">{value}</div>
      {detail ? <div className="mt-2 text-sm leading-6 text-slate-600">{detail}</div> : null}
    </div>
  );
}
