import { urqlClient } from "@/lib/urql-client";
import { graphql } from "../generated";
import { unstable_cache } from "next/cache";

export const query = graphql(`query getDepoimentosHome {
  depoimentos {
    edges {
      node {
        title
        acfDepoimentos {
          role
          text
        }
      }
    }
  }
}`);

async function fetchDepoimentos() {
  try {
    const { data } = await urqlClient.query(query, {}).toPromise();

    if (!data?.depoimentos?.edges) {
      console.warn("getDepoimentos: Nenhum depoimento encontrado");
      return { depoimentos: { edges: [] } };
    }

    return data;
  } catch (err) {
    console.error("Erro ao buscar depoimentos:", err);
    return { depoimentos: { edges: [] } };
  }
}

export const getDepoimentos = unstable_cache(fetchDepoimentos, ["getDepoimentos"], {
  tags: ["depoimentos"],
});
