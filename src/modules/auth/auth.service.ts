// src/modules/auth/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../core/database/prisma.js';

// No futuro, usaremos Zod para validar o corpo da requisição
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loginService(loginData: any) {
  // 1. Encontrar o usuário pelo nome de usuário (username)
  const user = await prisma.usuario.findUnique({
    where: { username: loginData.username },
  });

  // 2. Se o usuário não existir, lançar um erro.
  // Usamos uma mensagem genérica por segurança para não informar se o erro foi no usuário ou na senha.
  if (!user) {
    throw new Error('Usuário ou senha inválidos.');
  }

  // 3. Comparar a senha enviada com o hash salvo no banco de dados
  const isPasswordCorrect = await bcrypt.compare(
    loginData.password,
    user.passwordHash,
  );

  // 4. Se a senha estiver incorreta, lançar o mesmo erro genérico
  if (!isPasswordCorrect) {
    throw new Error('Usuário ou senha inválidos.');
  }

  // 5. Se as credenciais estiverem corretas, gerar o token JWT
  const token = jwt.sign(
    {
      // Payload: Informações que queremos guardar dentro do token
      name: user.name,
      username: user.username,
    },
    process.env.JWT_SECRET as string, // Chave secreta do .env
    {
      subject: user.id, // O "dono" do token (ID do usuário)
      expiresIn: '1d', // O token expira em 1 dia
    },
  );

  // 6. Retornar o token gerado
  return { token };
}