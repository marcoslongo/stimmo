import { urqlClient } from "@/lib/urql-client";
import { graphql } from "../generated";
import { unstable_cache } from "next/cache";

export const query = graphql(`query getPortfolioHome {
  projetos(first: 1000) {
    edges {
      node {
        id
        title
        slug
        tags {
          edges {
            node {
              id
              name
            }
          }
        }
        categoriasPortfolio {
          edges {
            node {
              id
              name
            }
          }
        }
        acfPortfolio {
          image {
            node {
              mediaItemUrl
            }
          }
          description
          gallery {
            nodes {
              mediaItemUrl
            }
          }
        }
      }
    }
  }
}`);

async function fetchPortfolio() {
  try {
    const { data } = await urqlClient.query(query, {}).toPromise();

    if (!data?.projetos?.edges) {
      console.warn("getPortfolio: Nenhum projeto encontrado");
      return { projetos: { edges: [] } };
    }

    return data;
  } catch (err) {
    console.error("Erro ao buscar portfólio:", err);
    return { projetos: { edges: [] } }; 
  }
}

export const getPortfolio = unstable_cache(fetchPortfolio, ["getPortfolio"], {
  tags: ["portfolio"],
});
