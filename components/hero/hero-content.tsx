"use client"

import { motion, Variants } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const textVariants: Variants = {
  hidden: { opacity: 0, x: -40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.17, 0.55, 0.55, 1], delay: 0.2 },
  },
}

export function HeroContent() {
  return (
    <motion.div
      className="space-y-8 text-center lg:text-left"
      variants={textVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-balance leading-tight text-white">
        Solicite seu projeto de móveis planejados e maximize seus sonhos
      </h1>
      <p className="text-lg md:text-xl text-white leading-relaxed">
        Indústria com quase 40 anos de tradição e marca com revendas em todo o país.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center items-center pt-4">
        <Button
          size="lg"
          variant="outline"
          className="px-8 py-6 text-lg border-2 bg-[#f21e1d] hover:bg-[#f21e1d] border-[#f21e1d] group text-white hover:text-white cursor-pointer"
          onClick={() =>
            document.getElementById("lojas")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Escolha sua unidade
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  )
}