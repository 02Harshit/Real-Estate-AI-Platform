export default function LoadingState({ label = "Loading..." }) {
  return (
    <div className="surface-card rounded-[2rem] p-10">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-orange-500" />
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      </div>
    </div>
  );
}
