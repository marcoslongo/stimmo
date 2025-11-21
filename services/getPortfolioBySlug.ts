import { urqlClient } from "@/lib/urql-client";
import { graphql } from "@/generated";
import {
  GetProjetoBySlugDocument,
  GetProjetoBySlugQuery,
  GetProjetoBySlugQueryVariables,
} from "@/generated/graphql";

export const query = graphql(`query getProjetoBySlug($slug: ID!) {
  projeto(id: $slug, idType: SLUG) {
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
}`);

export async function getPortfolioBySlug(slug: string) {
  try {
    const { data, error } = await urqlClient
      .query<GetProjetoBySlugQuery, GetProjetoBySlugQueryVariables>(
        GetProjetoBySlugDocument,
        { slug },
        {
          fetchOptions: {
            cache: "no-store",
            next: {
              tags: ["portfolio"],
            },
          },
        }
      )
      .toPromise();

    if (error) {
      console.error("Erro GraphQL em getPortfolioBySlug:", error);
      return null;
    }

    if (!data?.projeto) {
      console.warn(`getPortfolioBySlug: Nenhum projeto encontrado para o slug "${slug}"`);
      return null;
    }

    return data.projeto;
  } catch (err) {
    console.error("Erro inesperado em getPortfolioBySlug:", err);
    return null;
  }
}
