import FeatureSection from "../components/FeatureSection";
import HeroSection from "../components/HeroSection";
import ProductGrid from "../components/ProductGrid";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

const HomePage = () => {
  const { addToCart } = useCart();
  const { categories, featuredProducts } = useProducts();

  return (
    <>
      <HeroSection />
      <FeatureSection categories={categories} />
      <ProductGrid products={featuredProducts} onAddToCart={addToCart} />
    </>
  );
};

export default HomePage;
