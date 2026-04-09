function StatCard({ label, value, hint }) {
  return (
    <article className="rounded-2xl border border-leaf-100 bg-white/85 p-3 shadow-sm backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-leaf-700/70">
        {label}
      </p>
      <p className="mt-1 text-lg font-extrabold text-leaf-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-leaf-700/80">{hint}</p>}
    </article>
  );
}

export default StatCard;
