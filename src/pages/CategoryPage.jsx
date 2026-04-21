import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

const CategoryPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { categories, getProductsByCategory } = useProducts();
  const category = categories.find((item) => item.slug === slug);
  const products = getProductsByCategory(slug);

  if (!category) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-32 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-white">Category not found</h1>
        <p className="mt-3 text-textSoft">Please choose a valid product category.</p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-sm border border-brushedGold px-6 py-3 text-sm font-semibold text-brushedGold transition hover:bg-brushedGold hover:text-obsidian"
        >
          Back to Home
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-[#06080B] py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={category.title}
          subtitle={`Explore our curated ${category.title.toLowerCase()} collection.`}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} onAddToCart={addToCart} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryPage;
