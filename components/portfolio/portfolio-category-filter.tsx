import { motion } from "framer-motion"
import { GetCategoriasPortfolioHomeQuery } from "@/generated/graphql"

interface CategoryFilterProps {
  categories: GetCategoriasPortfolioHomeQuery;
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
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
          className={`relative overflow-hidden rounded-full px-8 py-3 text-sm font-medium transition-all cursor-pointer duration-300 ${
            activeCategory === category.node.id
              ? "bg-[#f21e1d] text-white shadow-lg shadow-crimson/30"
              : "bg-white text-charcoal hover:bg-charcoal/5"
          }`}
        >
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