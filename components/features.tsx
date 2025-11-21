"use client"

import { motion, useInView, easeOut } from "framer-motion"
import { useRef } from "react"
import { Truck, PencilRuler, Factory, Cpu } from "lucide-react"

const features = [
  {
    icon: Cpu,
    title: "Tecnologia Europeia",
    description: "Acessórios importados da Europa com a mais alta qualidade e design sofisticado",
  },
  {
    icon: PencilRuler,
    title: "100% Personalizável",
    description: "Liberdade total para criar: ajuste largura, altura e cada detalhe do seu projeto",
  },
  {
    icon: Factory,
    title: "Indústria 4.0",
    description: "Parque fabril automatizado com processos de alta precisão e tecnologia de ponta",
  },
  {
    icon: Truck,
    title: "Entrega Rápida",
    description: "Frota própria garantindo segurança, agilidade e prazos reduzidos",
  },
]

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  }

  return (
    <section className="py-20 bg-muted" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-balance">
              Diferenciais que transformam ambientes.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Entre tecnologia, design e praticidade, criamos ambientes que acompanham o seu ritmo e maximizam cada momento.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => (
              <motion.div key={index} className="text-center space-y-4" variants={itemVariants}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#f21e1d]">
                  <feature.icon className="h-8 w-8 text-[#f21e1d]" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-xl">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}