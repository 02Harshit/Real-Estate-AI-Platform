export default function Footer() {
  return (
    <footer className="mx-auto mt-16 w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="surface-card rounded-[2rem] px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-extrabold uppercase tracking-[0.28em] text-slate-500">
              AI-led property discovery
            </div>
            <h3 className="font-display mt-3 text-3xl leading-tight text-slate-950">
              Real listings, AI answers, and a cleaner path from curiosity to closing.
            </h3>
          </div>
          <div className="text-sm leading-7 text-slate-600">
            <div>Built for fast property search, smart support, and admin visibility.</div>
            <div className="mt-1">Frontend powered by React, Vite, Tailwind, Framer Motion, and Axios.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
