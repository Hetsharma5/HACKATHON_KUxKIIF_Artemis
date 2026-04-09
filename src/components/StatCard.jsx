function StatCard({ label, value, hint, suffix }) {
  // If suffix is not provided but value ends with common units, we can extract them
  // Or rely entirely on the explicit `suffix` prop
  let displayValue = value;
  let displaySuffix = suffix;
  
  if (!displaySuffix && typeof value === 'string') {
    const match = value.match(/^(.*?)\s+(sqm|kg|q)$/);
    if (match) {
      displayValue = match[1];
      displaySuffix = match[2];
    }
  }

  return (
    <article 
      className="rounded-2xl bg-[#FFFFFF] p-5 text-left border border-gray-100"
      style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-[#1F2937] flex items-baseline">
        {displayValue}
        {displaySuffix && <span className="ml-1 text-sm font-medium text-[#6B7280]">{displaySuffix}</span>}
      </p>
      {hint && <p className="mt-2 text-xs text-[#6B7280]">{hint}</p>}
    </article>
  );
}

export default StatCard;
