/**
 * Shared heading block used at the top of every major section:
 * a small gold eyebrow label, a large serif headline, and a thin
 * gold divider beneath — the recurring structural signature seen
 * across all three reference concepts.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}) {
  const alignClass = align === "left" ? "text-left items-start" : "text-center items-center";

  return (
    <div className={`flex flex-col gap-4 ${alignClass}`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-500">
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight ${
          light ? "text-cream-100" : "text-coffee-900"
        }`}
      >
        {title}
      </h2>
      <div className="h-px w-16 bg-gold-500/60" />
      {description && (
        <p
          className={`max-w-xl text-base sm:text-lg ${
            light ? "text-cream-300" : "text-coffee-700"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
