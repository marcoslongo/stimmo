import { urqlClient } from "@/lib/urql-client";
import { graphql } from "../generated";
import { unstable_cache } from "next/cache";

export const query = graphql(`query getCelebridadesHome {
  celebridades {
    edges {
      node {
        title
        id
        acfCelebridades {
          followers
          image {
            node {
              mediaItemUrl
            }
          }
          role
        }
      }
    }
  }
}`);

async function fetchCelebridades() {
  try {
    const { data } = await urqlClient.query(query, {}).toPromise();

    if (!data?.celebridades?.edges) {
      console.warn("getCelebridades: Nenhuma celebridade encontrada");
      return { celebridades: { edges: [] } };
    }

    return data;
  } catch (err) {
    console.error("Erro ao buscar celebridades:", err);
    return { celebridades: { edges: [] } };
  }
}

export const getCelebridades = unstable_cache(fetchCelebridades, ["getCelebridades"], {
  tags: ["celebridades"],
});
