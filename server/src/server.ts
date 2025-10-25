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
  createdById: ID!
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

  deleteService(id: ID!): Boolean!

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

      const fullDateStart = new Date(`${args.data}T${args.godzinaRozp || '00:00'}`);
      const fullDateEnd = new Date(`${args.data}T${args.godzinaZak || '00:00'}`);

      return prisma.service.create({
        data: {
          name: args.name,
          wykonawca: args.wykonawca || '',
          data: fullDateStart,
          godzinaRozp: args.godzinaRozp || '',
          godzinaZak: args.godzinaZak || '',
          opis: args.opis || '',
          createdBy: { connect: { id: context.user.id } },
        },
        include: { createdBy: true },
      });
    },

    deleteService: async (parent: any, { id }, context: Context) => {
      if (!context.user) throw new Error('Unauthorized');

      const service = await prisma.service.findUnique({ where: { id } });
      if (!service) throw new Error("Service not found!");

      // Sprawdzenie uprawnień: tylko właściciel lub ADMIN może usuwać
      if (service.createdById !== context.user.id && context.user.role !== UserRole.ADMIN) {
        throw new Error('Unauthorized');
      }

      await prisma.service.delete({ where: { id } });
      return true;
    },

    login: async (parent: any, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('Invalid credentials');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid credentials');

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

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
