import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('123321', 10);
  await prisma.user.create({
    data: {
      email: 'wekpat@wp.pl',
      name: 'Admin',
      password: hashed,
      role: UserRole.ADMIN,
    },
  });
  console.log('User created');
}

main();
