export default function EmptyState({ title, description, action }) {
  return (
    <div className="surface-card rounded-[2rem] p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
        AI
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
