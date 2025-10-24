import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

interface Context {
  user?: { id: string; email: string; role: UserRole };
}

// --- GraphQL typeDefs ---
const typeDefs = `#graphql
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
}

type AuthPayload {
  token: String!
  user: User!
}

type Service {
  id: ID!
  name: String!
  wykonawca: String!
  data: String!
  godzinaRozp: String
  godzinaZak: String
  opis: String
  createdBy: User!
}

type Query {
  calendarItems: [Service!]!
}

type Mutation {
  addItem(
    name: String!
    wykonawca: String
    data: String!
    godzinaRozp: String
    godzinaZak: String
    opis: String
  ): Service!

  login(email: String!, password: String!): AuthPayload!
}
`;

// --- Resolvers ---
const resolvers = {
  Query: {
    calendarItems: async () => {
      return prisma.service.findMany({ include: { createdBy: true } });
    },
  },
  Mutation: {
    addItem: async (parent: any, args: any, context: Context) => {
      if (!context.user) throw new Error('Unauthorized');

      return prisma.service.create({
        data: {
          name: args.name,
          wykonawca: args.wykonawca || '',
          data: new Date(args.data),
          godzinaRozp: args.godzinaRozp || '',
          godzinaZak: args.godzinaZak || '',
          opis: args.opis || '',
          createdById: context.user.id,
        },
        include: { createdBy: true },
      });
    },
    login: async (parent: any, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('Invalid credentials');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid credentials');

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });

      return { token, user };
    },
  },
};

// --- Apollo Server ---
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req.headers.authorization || '';
    if (auth.startsWith('Bearer ')) {
      const token = auth.slice(7);
      try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        return { user: { id: payload.id, email: payload.email, role: payload.role } };
      } catch (e) {
        return {};
      }
    }
    return {};
  },
}).then(({ url }) => console.log(`Server ready at ${url}`));
