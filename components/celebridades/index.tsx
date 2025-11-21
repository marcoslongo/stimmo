import { getCelebridades } from "@/services/getCelebridades";
import { ContentCelebridades } from "./content-celebridades";

export async function Celebridades() {
  const data = await getCelebridades();
  return (
    <ContentCelebridades data={data} />
  );
}