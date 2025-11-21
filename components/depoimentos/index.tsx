import { getDepoimentos } from "@/services/getDepoimentos"
import { ContentDepoimentos } from "./content-depoimentos"

export async function Depoimentos() {
  const data = await getDepoimentos();
  return (
    <ContentDepoimentos data={data} />
  );
}
