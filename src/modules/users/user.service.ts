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

/**
 * Atualiza os dados de um usuário existente.
 * @param userId O ID do usuário a ser atualizado.
 * @param data Os novos dados para o usuário.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateUserService(userId: string, data: any) {
  // 1. Verificar se o usuário que queremos atualizar realmente existe
  const userToUpdate = await prisma.usuario.findUnique({
    where: { id: userId },
  });

  if (!userToUpdate) {
    throw new Error('Usuário não encontrado.');
  }

  // 2. Se um novo username foi enviado, verificar se ele já está em uso por OUTRO usuário
  if (data.username) {
    const existingUserByUsername = await prisma.usuario.findUnique({
      where: { username: data.username },
    });
    if (existingUserByUsername && existingUserByUsername.id !== userId) {
      throw new Error('Este nome de usuário já está em uso.');
    }
  }

  // 3. Se um novo e-mail foi enviado, verificar se ele já está em uso por OUTRO usuário
  if (data.email) {
    const existingUserByEmail = await prisma.usuario.findUnique({
      where: { email: data.email },
    });
    if (existingUserByEmail && existingUserByEmail.id !== userId) {
      throw new Error('Este e-mail já está em uso.');
    }
  }

  // 4. Atualizar os dados do usuário no banco
  // Apenas os campos fornecidos em 'data' serão atualizados.
  const updatedUser = await prisma.usuario.update({
    where: { id: userId },
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
      phone: data.phone,
      isActive: data.isActive,
    },
  });

  // 5. Retornar o usuário atualizado sem o hash da senha
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
}

/**
 * Lista todos os usuários cadastrados no sistema.
 */
export async function listUsersService() {
  const users = await prisma.usuario.findMany({
    // Seleciona explicitamente os campos que queremos retornar,
    // omitindo o passwordHash por segurança.
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      phone: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      name: 'asc', // Ordena por nome em ordem alfabética
    },
  });

  return users;
}

