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
      <h1 className="text-3xl md:text-4xl lg:text-4xl text-balance leading-tight text-white">
        Sofisticação em cada detalhe.{" "}
        <Image alt="" src="/assets/images/milimetricamente-2.webp" width={662} height={121} />
      </h1>
      <p className="text-lg md:text-xl text-white leading-relaxed">
        A melhor experiência é se sentir em casa, em ambientes personalizados milimetricamente para refletir quem você é.
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