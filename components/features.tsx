"use client"

import { motion, useInView, easeOut } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Package2, PencilRuler, Truck, Palette, Award } from "lucide-react"
import Image from "next/image"

const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let interval: NodeJS.Timeout
    const increment = Math.ceil(value / 50)
    let current = 0

    interval = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(interval)
      } else {
        setDisplayValue(current)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [isInView, value])

  return (
    <span ref={ref}>
      {displayValue.toLocaleString("pt-BR")}
      {suffix}
    </span>
  )
}

const features = [
  {
    icon: Palette,
    title: "30+ Opções de Cores",
    description: "Cores unicolores e acabamentos amadeirados para valorizar seus projetos",
    highlight: "30",
    suffix: "+",
  },
  {
    icon: Award,
    title: "100+ Revendas",
    description: "Presença forte em todo o Brasil com parceiros de confiança",
    highlight: "100",
    suffix: "+",
  },
  {
    icon: Package2,
    title: "Lacca e Vidro",
    description: "Acabamentos premium em lacca brilhante e vidro temperado",
    highlight: "Premium",
    suffix: "",
  },
  {
    icon: Truck,
    title: "Frota Própria",
    description: "Transporte seguro e ágil com nossa frota em todo o Brasil",
    highlight: "Agilidade",
    suffix: "",
  },
  {
    icon: PencilRuler,
    title: "100% Editável",
    description: "Liberdade total: personalize largura, altura e cada detalhe do seu projeto",
    highlight: "Total",
    suffix: "",
  },
]

const colors = ["#037856", "#FFD201", "#F11E1D", "#3A3156", "#F9BBA8"]

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  }

  return (
    <section className="py-40 bg-slate-50 dark:bg-slate-950 relative" ref={ref}>
      <Image
        src={'/assets/images/img_vermelho.webp'}
        alt=''
        width={800}
        height={100}
        className="absolute right-0 top-0"
      />
      <Image
        src={'/assets/images/img_vermelho.webp'}
        alt=''
        width={800}
        height={100}
        className="absolute left-0 bottom-0"
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-slate-900 dark:text-white">
              Diferenciais que transformam ambientes
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Tecnologia alemã, variedade incomparável e compromisso com a qualidade em cada projeto.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-6 items-center justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => {
              const bg = colors[index]

              return (
                <motion.div
                  key={index}
                  className="w-[30%] group p-6 rounded-3xl shadow-lg transition-all duration-300 text-white"
                  style={{ backgroundColor: bg }}
                  variants={itemVariants}
                >
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-lg mb-4 border-2"
                    style={{
                      borderColor: "#FFFFFF",
                      backgroundColor: "#FFFFFF22",
                    }}
                  >
                    <feature.icon
                      className="h-7 w-7 text-white"
                      strokeWidth={1.5}
                    />
                  </div>

                  <h3 className="font-semibold text-lg mb-2 text-white">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-relaxed mb-4 text-white/90">
                    {feature.description}
                  </p>

                  {feature.highlight && (
                    <div
                      className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                      style={{
                        backgroundColor: "#FFFFFF22",
                        color: "#FFFFFF",
                      }}
                    >
                      {feature.highlight}
                      {feature.suffix}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>

        </div>
      </div>
    </section>
  )
}