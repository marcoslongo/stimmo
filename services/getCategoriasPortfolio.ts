import { urqlClient } from "@/lib/urql-client";
import { graphql } from "../generated";
import { unstable_cache } from "next/cache";

export const query = graphql(`query getCategoriasPortfolioHome {
  categoriasPortfolio {
    edges {
      node {
        id
        name
        icone {
          sourceUrl
        }
      }
    }
  }
}`);

async function fetchCategoriasPortfolio() {
  try {
    const { data } = await urqlClient.query(query, {}).toPromise();

    if (!data?.categoriasPortfolio?.edges) {
      console.warn("getCategoriasPortfolio: Nenhuma categoria encontrada");
      return { categoriasPortfolio: { edges: [] } };
    }

    return data;
  } catch (err) {
    console.error("Erro ao buscar categorias do portfólio:", err);
    return { categoriasPortfolio: { edges: [] } };
  }
}

export const getCategoriasPortfolio = unstable_cache(fetchCategoriasPortfolio, ["getCategoriasPortfolio"], {
  tags: ["portfolio"],
});
