import CategoryCard from "./CategoryCard";
import SectionHeading from "./SectionHeading";

const FeatureSection = ({ categories }) => {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading title="Shop by Category" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} {...category} />
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
