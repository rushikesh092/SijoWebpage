import ProductCard from "./ProductCard";
import SectionHeading from "./SectionHeading";

const ProductGrid = ({ products, onAddToCart }) => {
  return (
    <section id="products" className="bg-[#06080B] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Featured Products"
          subtitle="Curated premium fixtures crafted for modern and timeless interiors."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
