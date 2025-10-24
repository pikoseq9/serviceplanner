import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class UserService {
  async createUser(email: string, password: string, name: string, role: UserRole) {
    const hashed = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: { email, password: hashed, name, role },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async getUsers() {
    return prisma.user.findMany();
  }
}
