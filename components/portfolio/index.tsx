import { getPortfolio } from "@/services/getPortfolio";
import PortfolioSection from "./portfolio-section";
import { getCategoriasPortfolio } from "@/services/getCategoriasPortfolio";
import { getLojas } from "@/services/getLojas";

export async function Portfolio() {
  const data = await getPortfolio();
  const categories = await getCategoriasPortfolio();
  const lojas = await getLojas();

  return (
    <PortfolioSection
      data={data}
      categories={categories} 
      lojas={lojas}
    />
  );
}
