'use client'

import { GetCelebridadesHomeQuery } from "@/generated/graphql";
import { motion, useInView } from "framer-motion";
import Image from "next/image"
import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface ContentCelebridadesProps {
  data: GetCelebridadesHomeQuery;
}

export function ContentCelebridades({ data }: ContentCelebridadesProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const celebridades = data.celebridades?.edges || [];

  return (
    <section className="bg-[#F9BBA8] py-20" ref={ref}>
      <div className="max-w-6xl mx-auto bg-white rounded-lg">
        <motion.div
          className="p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-4xl font-semibold mb-6">
            Escolha de influenciadores e personalidades
          </h3>

          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {celebridades.map((celeb, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/4">
                  <motion.div
                    className="text-center select-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.8 }
                    }
                    transition={{
                      delay: 0.6 + index * 0.1,
                      duration: 0.4,
                    }}
                  >
                    <Image
                      width={360}
                      height={450}
                      alt={celeb.node.title!}
                      src={celeb.node.acfCelebridades?.image?.node.mediaItemUrl!}
                      className="shadow rounded-xl mb-2.5 w-full"
                    />
                    <p className="font-bold text-lg">{celeb.node.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {celeb.node.acfCelebridades?.role}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {celeb.node.acfCelebridades?.followers}
                    </p>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-4">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}