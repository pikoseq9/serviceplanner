import gql from "graphql-tag"

export const typeDefs = gql`
  enum UserRole {
    ADMIN
    ZARZADCA
    ORGANIZATOR
    REALIZATOR
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: UserRole!
    createdAt: String!
  }

  type Service {
    id: ID!
    name: String!
    wykonawca: String!
    data: String!
    godzinaRozp: String!
    godzinaZak: String!
    opis: String!
    createdBy: User!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    users: [User!]!
    services: [Service!]!
  }

  input CreateServiceInput {
    name: String!
    wykonawca: String!
    data: String!
    godzinaRozp: String!
    godzinaZak: String!
    opis: String!
  }

  type Mutation {
    register(email: String!, password: String!, name: String!, role: UserRole): User!
    login(email: String!, password: String!): AuthPayload!
    createService(input: CreateServiceInput!): Service!
  }
`;
