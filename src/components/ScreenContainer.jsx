import { Link } from "react-router-dom";

function ScreenContainer({ title, subtitle, children, backTo }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col text-leaf-950">
      <header className="px-4 pb-4 pt-5">
        <div className="mb-3 flex items-center justify-between">
          {backTo ? (
            <Link
              to={backTo}
              className="rounded-xl border border-leaf-200 bg-white/80 px-3 py-1.5 text-sm font-semibold text-leaf-800 transition hover:bg-leaf-50"
            >
              Back
            </Link>
          ) : (
            <span />
          )}
          <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-leaf-700">
            KisanSarthi
          </span>
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-leaf-900">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-leaf-800/90">{subtitle}</p>}
      </header>
      <main className="flex-1 px-4 pb-4">{children}</main>
    </div>
  );
}

export default ScreenContainer;
