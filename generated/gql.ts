/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query getCelebridadesHome {\n  celebridades {\n    edges {\n      node {\n        title\n        id\n        acfCelebridades {\n          followers\n          image {\n            node {\n              mediaItemUrl\n            }\n          }\n          role\n        }\n      }\n    }\n  }\n}": typeof types.GetCelebridadesHomeDocument,
    "query getDepoimentosHome {\n  depoimentos {\n    edges {\n      node {\n        title\n        acfDepoimentos {\n          role\n          text\n        }\n      }\n    }\n  }\n}": typeof types.GetDepoimentosHomeDocument,
    "query getLojasHome {\n  lojas(first: 1000) {\n    edges {\n      node {\n        id\n        databaseId\n        acfLojas {\n          cidade\n          emails {\n            email\n          }\n          endereco\n          estado\n          galeriaFotos {\n            nodes {\n              mediaItemUrl\n            }\n          }\n          horarioFuncionamento\n          latitude\n          longitude\n          nomeLoja\n          telefone\n          whatsapp\n        }\n      }\n    }\n  }\n}": typeof types.GetLojasHomeDocument,
    "query getCategoriasPortfolioHome {\n  categoriasPortfolio {\n    edges {\n      node {\n        id\n        name\n        icone {\n          sourceUrl\n        }\n      }\n    }\n  }\n}": typeof types.GetCategoriasPortfolioHomeDocument,
    "query getPortfolioHome {\n  projetos(first: 1000) {\n    edges {\n      node {\n        id\n        title\n        slug\n        tags {\n          edges {\n            node {\n              id\n              name\n            }\n          }\n        }\n        categoriasPortfolio {\n          edges {\n            node {\n              id\n              name\n              icone {\n                sourceUrl\n              }\n            }\n          }\n        }\n        acfPortfolio {\n          image {\n            node {\n              mediaItemUrl\n            }\n          }\n          description\n          gallery {\n            nodes {\n              mediaItemUrl\n            }\n          }\n        }\n      }\n    }\n  }\n}": typeof types.GetPortfolioHomeDocument,
    "query getProjetoBySlug($slug: ID!) {\n  projeto(id: $slug, idType: SLUG) {\n    id\n    title\n    slug\n    tags {\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n    categoriasPortfolio {\n      edges {\n        node {\n          id\n          name\n          icone {\n            sourceUrl\n          }\n        }\n      }\n    }\n    acfPortfolio {\n      image {\n        node {\n          mediaItemUrl\n        }\n      }\n      description\n      gallery {\n        nodes {\n          mediaItemUrl\n        }\n      }\n    }\n  }\n}": typeof types.GetProjetoBySlugDocument,
};
const documents: Documents = {
    "query getCelebridadesHome {\n  celebridades {\n    edges {\n      node {\n        title\n        id\n        acfCelebridades {\n          followers\n          image {\n            node {\n              mediaItemUrl\n            }\n          }\n          role\n        }\n      }\n    }\n  }\n}": types.GetCelebridadesHomeDocument,
    "query getDepoimentosHome {\n  depoimentos {\n    edges {\n      node {\n        title\n        acfDepoimentos {\n          role\n          text\n        }\n      }\n    }\n  }\n}": types.GetDepoimentosHomeDocument,
    "query getLojasHome {\n  lojas(first: 1000) {\n    edges {\n      node {\n        id\n        databaseId\n        acfLojas {\n          cidade\n          emails {\n            email\n          }\n          endereco\n          estado\n          galeriaFotos {\n            nodes {\n              mediaItemUrl\n            }\n          }\n          horarioFuncionamento\n          latitude\n          longitude\n          nomeLoja\n          telefone\n          whatsapp\n        }\n      }\n    }\n  }\n}": types.GetLojasHomeDocument,
    "query getCategoriasPortfolioHome {\n  categoriasPortfolio {\n    edges {\n      node {\n        id\n        name\n        icone {\n          sourceUrl\n        }\n      }\n    }\n  }\n}": types.GetCategoriasPortfolioHomeDocument,
    "query getPortfolioHome {\n  projetos(first: 1000) {\n    edges {\n      node {\n        id\n        title\n        slug\n        tags {\n          edges {\n            node {\n              id\n              name\n            }\n          }\n        }\n        categoriasPortfolio {\n          edges {\n            node {\n              id\n              name\n              icone {\n                sourceUrl\n              }\n            }\n          }\n        }\n        acfPortfolio {\n          image {\n            node {\n              mediaItemUrl\n            }\n          }\n          description\n          gallery {\n            nodes {\n              mediaItemUrl\n            }\n          }\n        }\n      }\n    }\n  }\n}": types.GetPortfolioHomeDocument,
    "query getProjetoBySlug($slug: ID!) {\n  projeto(id: $slug, idType: SLUG) {\n    id\n    title\n    slug\n    tags {\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n    categoriasPortfolio {\n      edges {\n        node {\n          id\n          name\n          icone {\n            sourceUrl\n          }\n        }\n      }\n    }\n    acfPortfolio {\n      image {\n        node {\n          mediaItemUrl\n        }\n      }\n      description\n      gallery {\n        nodes {\n          mediaItemUrl\n        }\n      }\n    }\n  }\n}": types.GetProjetoBySlugDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query getCelebridadesHome {\n  celebridades {\n    edges {\n      node {\n        title\n        id\n        acfCelebridades {\n          followers\n          image {\n            node {\n              mediaItemUrl\n            }\n          }\n          role\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query getCelebridadesHome {\n  celebridades {\n    edges {\n      node {\n        title\n        id\n        acfCelebridades {\n          followers\n          image {\n            node {\n              mediaItemUrl\n            }\n          }\n          role\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query getDepoimentosHome {\n  depoimentos {\n    edges {\n      node {\n        title\n        acfDepoimentos {\n          role\n          text\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query getDepoimentosHome {\n  depoimentos {\n    edges {\n      node {\n        title\n        acfDepoimentos {\n          role\n          text\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query getLojasHome {\n  lojas(first: 1000) {\n    edges {\n      node {\n        id\n        databaseId\n        acfLojas {\n          cidade\n          emails {\n            email\n          }\n          endereco\n          estado\n          galeriaFotos {\n            nodes {\n              mediaItemUrl\n            }\n          }\n          horarioFuncionamento\n          latitude\n          longitude\n          nomeLoja\n          telefone\n          whatsapp\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query getLojasHome {\n  lojas(first: 1000) {\n    edges {\n      node {\n        id\n        databaseId\n        acfLojas {\n          cidade\n          emails {\n            email\n          }\n          endereco\n          estado\n          galeriaFotos {\n            nodes {\n              mediaItemUrl\n            }\n          }\n          horarioFuncionamento\n          latitude\n          longitude\n          nomeLoja\n          telefone\n          whatsapp\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query getCategoriasPortfolioHome {\n  categoriasPortfolio {\n    edges {\n      node {\n        id\n        name\n        icone {\n          sourceUrl\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query getCategoriasPortfolioHome {\n  categoriasPortfolio {\n    edges {\n      node {\n        id\n        name\n        icone {\n          sourceUrl\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query getPortfolioHome {\n  projetos(first: 1000) {\n    edges {\n      node {\n        id\n        title\n        slug\n        tags {\n          edges {\n            node {\n              id\n              name\n            }\n          }\n        }\n        categoriasPortfolio {\n          edges {\n            node {\n              id\n              name\n              icone {\n                sourceUrl\n              }\n            }\n          }\n        }\n        acfPortfolio {\n          image {\n            node {\n              mediaItemUrl\n            }\n          }\n          description\n          gallery {\n            nodes {\n              mediaItemUrl\n            }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query getPortfolioHome {\n  projetos(first: 1000) {\n    edges {\n      node {\n        id\n        title\n        slug\n        tags {\n          edges {\n            node {\n              id\n              name\n            }\n          }\n        }\n        categoriasPortfolio {\n          edges {\n            node {\n              id\n              name\n              icone {\n                sourceUrl\n              }\n            }\n          }\n        }\n        acfPortfolio {\n          image {\n            node {\n              mediaItemUrl\n            }\n          }\n          description\n          gallery {\n            nodes {\n              mediaItemUrl\n            }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query getProjetoBySlug($slug: ID!) {\n  projeto(id: $slug, idType: SLUG) {\n    id\n    title\n    slug\n    tags {\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n    categoriasPortfolio {\n      edges {\n        node {\n          id\n          name\n          icone {\n            sourceUrl\n          }\n        }\n      }\n    }\n    acfPortfolio {\n      image {\n        node {\n          mediaItemUrl\n        }\n      }\n      description\n      gallery {\n        nodes {\n          mediaItemUrl\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query getProjetoBySlug($slug: ID!) {\n  projeto(id: $slug, idType: SLUG) {\n    id\n    title\n    slug\n    tags {\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n    categoriasPortfolio {\n      edges {\n        node {\n          id\n          name\n          icone {\n            sourceUrl\n          }\n        }\n      }\n    }\n    acfPortfolio {\n      image {\n        node {\n          mediaItemUrl\n        }\n      }\n      description\n      gallery {\n        nodes {\n          mediaItemUrl\n        }\n      }\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;