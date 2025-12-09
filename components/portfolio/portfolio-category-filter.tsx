import { motion } from "framer-motion"
import { GetCategoriasPortfolioHomeQuery } from "@/generated/graphql"
import Image from "next/image";

interface CategoryFilterProps {
  categories: GetCategoriasPortfolioHomeQuery;
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  console.log(categories);
  return (
    <div className="mb-12 flex flex-wrap justify-center gap-3">
      {categories.categoriasPortfolio?.edges.map((category, index) => (
        <motion.button
          key={category.node.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onCategoryChange(category.node.id)}
          className={`flex border-2 items-center gap-4 relative overflow-hidden rounded-full px-8 py-3 text-sm font-medium transition-all cursor-pointer duration-300 ${activeCategory === category.node.id
              ? "border-[#f21e1d] text-[#f21e1d] shadow-lg shadow-crimson/30"
              : "bg-white text-[#f21e1d] hover:bg-charcoal/5"
            }`}
        >
          <Image
            alt=""
            width={40}
            height={40}
            src={category.node.icone?.sourceUrl!}
          />
          {category.node.name}
          {activeCategory === category.node.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 -z-10 bg-[#f21e1d]"
              transition={{ type: "spring", duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  )
}