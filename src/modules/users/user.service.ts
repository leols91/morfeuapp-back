// src/modules/users/user.service.ts

import { prisma } from '../../core/database/prisma.js';
import bcrypt from 'bcryptjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createUser(userData: any) {
  // 1A. Verificar se o username já existe
  const existingUserByUsername = await prisma.usuario.findUnique({
    where: { username: userData.username },
  });

  if (existingUserByUsername) {
    throw new Error('Este nome de usuário já está em uso.');
  }

  // 1B. Verificar se o e-mail já existe
  const existingUserByEmail = await prisma.usuario.findUnique({
    where: { email: userData.email },
  });

  if (existingUserByEmail) {
    throw new Error('Este e-mail já está em uso.');
  }

  // 2. Fazer o hash da senha
  const passwordHash = await bcrypt.hash(userData.password, 8);

  // 3. Criar o usuário no banco de dados, incluindo o username
  const user = await prisma.usuario.create({
    data: {
      name: userData.name,
      username: userData.username,
      email: userData.email,
      passwordHash: passwordHash,
    },
  });

  // 4. Retornar o usuário criado (sem a senha!)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}