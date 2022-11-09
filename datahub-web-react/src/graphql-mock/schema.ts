import { loader } from 'graphql.macro';

import gql from 'graphql-tag';
import { buildASTSchema } from 'graphql';

const authschema = loader('../../../datahub-graphql-core/src/main/resources/auth.graphql');
const entitySchema = loader('../../../datahub-graphql-core/src/main/resources/entity.graphql');
const searchSchema = loader('../../../datahub-graphql-core/src/main/resources/search.graphql');

const graphQLSchemaAST = gql`
    ${authschema}
    ${entitySchema}
    ${searchSchema}
`;

export const graphQLSchema = buildASTSchema(graphQLSchemaAST);
