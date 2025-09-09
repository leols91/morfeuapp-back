// src/core/middlewares/auth.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estendemos a interface Request do Express para poder adicionar a propriedade 'user'
interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    username: string;
  };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  // 1. Obter o cabeçalho de autorização
  const authHeader = req.headers.authorization;

  // 2. Verificar se o cabeçalho existe
  if (!authHeader) {
    return res.status(401).json({ message: 'Token de acesso não fornecido.' });
  }

  // 3. Dividir o cabeçalho para obter o token (formato: "Bearer TOKEN")
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token com formato inválido.' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token mal formatado.' });
  }

  // 4. Verificar a validade do token
  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      console.error('Erro na verificação do token:', err);
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }

    // 5. Se o token for válido, adicionamos os dados do usuário à requisição
    const decodedPayload = decoded as { sub: string, name: string, username: string };
    req.user = {
      id: decodedPayload.sub,
      name: decodedPayload.name,
      username: decodedPayload.username,
    };

    // 6. Passar para o próximo passo (o controller)
    return next();
  });
}