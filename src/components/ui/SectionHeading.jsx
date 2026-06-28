import AnimatedSectionHeading from "./AnimatedSectionHeading.jsx";

/**
 * Shared heading block used at the top of every major section:
 * a small gold eyebrow label, a large serif headline (animated
 * letter-by-letter when `animated` is true), and a thin gold divider
 * beneath — the recurring structural signature seen across all three
 * reference concepts.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  animated = true,
}) {
  const alignClass = align === "left" ? "text-left items-start" : "text-center items-center";

  const titleClass = `fluid-h2 font-display font-semibold leading-tight ${
    light ? "text-cream-100" : "text-coffee-900"
  }`;

  return (
    <div className={`flex flex-col gap-3 sm:gap-4 ${alignClass}`}>
      {eyebrow && (
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-500 sm:text-xs">
          {eyebrow}
        </span>
      )}
      {animated ? (
        <AnimatedSectionHeading title={title} className={titleClass} />
      ) : (
        <h2 className={titleClass}>{title}</h2>
      )}
      <div className="h-px w-12 bg-gold-500/60 sm:w-16" />
      {description && (
        <p
          className={`fluid-body max-w-xl ${
            light ? "text-cream-300" : "text-coffee-700"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
