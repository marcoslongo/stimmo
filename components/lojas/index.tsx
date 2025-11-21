import { getLojas } from "@/services/getLojas";
import { StoreSelector } from "./store-selector";

export async function Lojas() {
  const data = await getLojas();

  if (!data.lojas?.edges.length) {
    return <div>Sem lojas disponíveis no momento.</div>;
  }

  return <StoreSelector data={data} />;
}
