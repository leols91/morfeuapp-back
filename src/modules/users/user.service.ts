import { Prisma } from '@prisma/client';
import { prisma } from '../../core/database/prisma.js';
import bcrypt from 'bcryptjs';

// --- CRUD Padrão e Funções Públicas ---

/**
 * Cria um novo usuário (função pública de "sign-up").
 * Este usuário não é vinculado a nenhuma pousada no momento da criação.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createUserService(userData: any) {
  const existingUser = await prisma.usuario.findFirst({
    where: {
      OR: [{ email: userData.email }, { username: userData.username }],
      deletedAt: null,
    },
  });

  if (existingUser) {
    throw new Error('E-mail ou nome de usuário já está em uso.');
  }

  const passwordHash = await bcrypt.hash(userData.password, 8);

  const user = await prisma.usuario.create({
    data: {
      name: userData.name,
      username: userData.username,
      email: userData.email,
      passwordHash: passwordHash,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Lista todos os usuários ativos no sistema.
 */
export async function listUsersService() {
  const users = await prisma.usuario.findMany({
    where: { deletedAt: null },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      phone: true,
      isActive: true,
      createdAt: true,
    },
  });
  return users;
}

/**
 * Atualiza os dados de um usuário específico.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateUserService(userId: string, data: any) {
  return prisma.usuario.update({
    where: { id: userId },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      isActive: data.isActive,
    },
  });
}

/**
 * Exclui (soft delete) um usuário.
 */
export async function deleteUserService(userId: string) {
  return prisma.usuario.update({
    where: { id: userId },
    data: { deletedAt: new Date() },
  });
}

// --- Funções Específicas e Protegidas ---

/**
 * Busca os dados do usuário logado pelo seu ID.
 */
export async function getMeService(userId: string) {
  const user = await prisma.usuario.findUnique({
    where: { id: userId, deletedAt: null },
  });

  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Atualiza a senha do usuário logado.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updatePasswordService(userId: string, data: any) {
  const { oldPassword, newPassword } = data;

  const user = await prisma.usuario.findUnique({
    where: { id: userId, deletedAt: null },
  });

  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isPasswordCorrect) {
    throw new Error('A senha antiga está incorreta.');
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 8);

  await prisma.usuario.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  });
}

/**
 * Cria um novo usuário e o vincula diretamente a uma pousada (convite).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function inviteUserService(
  data: any,
  pousadaId: string,
  inviterId: string, // ID do usuário que está convidando
) {
  // 1. Verificar se o usuário que convida tem permissão na pousada
  const inviterHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: inviterId, pousadaId } },
  });
  if (!inviterHasAccess) {
    throw new Error('Acesso negado para convidar usuários para esta pousada.');
  }

  // 2. Verificar se o e-mail ou username do novo usuário já existem
  const existingUser = await prisma.usuario.findFirst({
    where: { OR: [{ email: data.email }, { username: data.username }] },
  });
  if (existingUser) {
    throw new Error('E-mail ou nome de usuário já está em uso.');
  }

  const passwordHash = await bcrypt.hash(data.password, 8);

  // 3. Usar uma transação para criar o usuário e o vínculo atomicamente
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const newUser = await tx.usuario.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        passwordHash,
      },
    });

    await tx.usuarioPousada.create({
      data: {
        usuarioId: newUser.id,
        pousadaId: pousadaId,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  });
}

