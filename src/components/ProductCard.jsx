const ProductCard = ({ name, price, image, stock, onAddToCart, ...product }) => {
  const stockClass =
    stock === "Out of Stock"
      ? "bg-slateGreySoft text-white/80"
      : "bg-brushedGold text-obsidian";
  const isOutOfStock = stock === "Out of Stock";

  return (
    <article className="group overflow-hidden border border-slateGreySoft bg-slateGrey shadow-luxe transition duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute right-3 top-3 rounded-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider ${stockClass}`}
        >
          {stock}
        </span>
      </div>
      <div className="space-y-3 p-5">
        <h3 className="text-2xl font-medium leading-snug text-white">{name}</h3>
        <p className="text-3xl font-semibold text-brushedGold">{price}</p>
        <button
          className="w-full rounded-sm border border-brushedGold px-4 py-2 text-sm font-medium text-brushedGold transition hover:bg-brushedGold hover:text-obsidian disabled:cursor-not-allowed disabled:border-white/25 disabled:text-white/50 disabled:hover:bg-transparent disabled:hover:text-white/50"
          onClick={() => onAddToCart?.({ name, price, image, stock, ...product })}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
