/**
 * Single menu item card. Pure presentational component — receives a
 * fully-formed item object from data/menuItems.js and renders it.
 */
export default function MenuCard({ item }) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl border border-gold-500/15
                 bg-coffee-900/60 transition-all duration-300 hover:border-gold-500/40
                 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
    >
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.tag && (
          <span
            className="absolute left-3 top-3 rounded-full bg-coffee-950/80 px-3 py-1
                       text-[11px] font-semibold uppercase tracking-wide text-gold-400
                       backdrop-blur-sm"
          >
            {item.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-xl font-semibold text-cream-100">{item.name}</h3>
        <div className="h-px w-10 bg-gold-500/50" />
        <p className="font-display text-2xl font-bold text-gold-400">
          {item.price}
          <span className="ml-1 text-sm font-medium text-cream-300">{item.currency}</span>
        </p>
      </div>
    </article>
  );
}
