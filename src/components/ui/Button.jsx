/**
 * Pill-shaped CTA button — the recurring signature element across all
 * three noirpixelagency concepts ("Order Online", "Learn More", etc).
 * Two visual variants: solid gold fill, or gold-outlined ghost.
 */
export default function Button({
  children,
  variant = "solid",
  as = "button",
  href,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 " +
    "text-sm font-semibold tracking-wide transition-all duration-300 " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500";

  const variants = {
    solid:
      "bg-gold-500 text-coffee-950 hover:bg-gold-400 shadow-lg shadow-gold-600/20 hover:shadow-gold-500/30 hover:-translate-y-0.5",
    ghost:
      "border border-gold-500/70 text-gold-400 hover:bg-gold-500/10 hover:border-gold-400 hover:-translate-y-0.5",
  };

  const classes = `${base} ${variants[variant]} ${className}`;
  const Tag = as;

  if (Tag === "a") {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
