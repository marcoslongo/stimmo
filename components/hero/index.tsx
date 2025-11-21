import { getLojas } from "@/services/getLojas";
import { HeroSection } from "./hero-section";

export async function Hero() {
  const lojas = await getLojas();

  return (
    <HeroSection lojas={lojas} />
  );
}