import { motion } from "framer-motion"
import Image from "next/image"
import { PortfolioItem as PortfolioItemType } from "@/types/portfolio"

interface PortfolioItemProps {
  item: PortfolioItemType
  index: number
  onSelectItem: (id: number) => void
}

export function PortfolioItem({ item, index, onSelectItem }: PortfolioItemProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelectItem(item.id)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer relative w-full text-left overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:shadow-md hover:shadow-charcoal/10 focus:outline-none focus:ring-2 focus:ring-charcoal/40 select-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="flex flex-wrap gap-2 mb-3">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-2 text-sm font-medium text-white transition-transform group-hover:translate-x-1">
            Ver detalhes
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm leading-relaxed text-charcoal/60 line-clamp-2">{item.description}</p>
      </div>
    </motion.button>
  )
}