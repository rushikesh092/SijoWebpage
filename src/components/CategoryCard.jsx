import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryCard = ({ slug, title, description, image }) => {
  return (
    <article className="group overflow-hidden border border-slateGreySoft bg-slateGrey shadow-luxe">
      <div className="overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2 p-6">
        <h3 className="text-3xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-textSoft">{description}</p>
        <Link
          to={`/category/${slug}`}
          className="inline-flex items-center gap-2 pt-1 text-sm font-medium text-brushedGold transition hover:text-brushedGoldSoft"
        >
          View Collection <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
};

export default CategoryCard;
