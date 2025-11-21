"use client"

import { motion, useInView, Variants } from "framer-motion"
import { useRef } from "react"
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Quote } from "lucide-react"
import { GetDepoimentosHomeQuery } from "@/generated/graphql"

interface ContentProps {
  data: GetDepoimentosHomeQuery;
}

export function ContentDepoimentos({ data }: ContentProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const depoimentos = data.depoimentos?.edges ?? [];

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  }

  return (
    <section className="pt-28 pb-10 bg-white" ref={ref} id="social-proof">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-balance">
              Confiança de quem já transformou seus ambientes
            </h2>
            <p className="text-lg text-muted-foreground">
              Confiança e credibilidade de uma indústria com quase 40 anos de mercado e atestada pelos nossos clientes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full mb-16"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {depoimentos.map(({ node }, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      transition={{ delay: index * 0.1 }}
                      className="h-full"
                    >
                      <Card className="p-6 space-y-4 h-full flex flex-col select-none bg-muted">
                        <Quote className="h-8 w-8 text-[#f21e1d]/80" />

                        <p className="text-muted-foreground leading-relaxed flex-grow">
                          {node.acfDepoimentos?.text}
                        </p>

                        <div className="flex items-center gap-3 pt-4 border-t mt-auto">
                          <div>
                            <p className="font-semibold">{node.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {node.acfDepoimentos?.role}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-6">
                <CarouselPrevious className="relative -translate-y-0" />
                <CarouselNext className="relative -translate-y-0" />
              </div>
            </Carousel>
          </motion.div>
        </div>
      </div>
    </section>
  )
}