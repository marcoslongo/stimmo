import { urqlClient } from "@/lib/urql-client";
import { graphql } from "../generated";
import type { OperationContext } from "urql";

export const query = graphql(`query getLojasHome {
  lojas(first: 1000) {
    edges {
      node {
        id
        databaseId
        acfLojas {
          cidade
          emails {
            email
          }
          endereco
          estado
          galeriaFotos {
            nodes {
              mediaItemUrl
            }
          }
          horarioFuncionamento
          latitude
          longitude
          nomeLoja
          telefone
          whatsapp
        }
      }
    }
  }
}`);

export async function getLojas() {
  const context: Partial<OperationContext> = {
    requestPolicy: 'network-only',
    fetchOptions: {
      cache: 'no-store',
      next: {
        tags: ['lojas'],
      },
    },
  };

  try {
    const { data } = await urqlClient.query(query, {}, context).toPromise();

    if (!data?.lojas?.edges) {
      return { lojas: { edges: [] } };
    }
    return data;
  } catch (err) {
    console.error("Erro ao buscar lojas:", err);
    return { lojas: { edges: [] } };
  }
}
