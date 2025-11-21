import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    'https://manager.simonetto.com.br/graphql': {
      headers: {
        Authorization: 'Bearer SEU_TOKEN_AQUI',
      },
    },
  },
  documents: ['queries/**/*.graphql'],
  ignoreNoDocuments: true,
  generates: {
    'generated/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'graphql',
      },
    },
  },
};

export default config;
