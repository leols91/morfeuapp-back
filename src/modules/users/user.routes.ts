import { Router } from 'express';
import { createUserController } from './user.controller.js';

const publicUserRoutes: Router = Router();
const protectedUserRoutes: Router = Router();

// --- ROTAS PÚBLICAS ---
// Rota para criar um novo usuário. Não precisa de token.
publicUserRoutes.post('/users', createUserController);

// --- ROTAS PROTEGIDAS ---
// Rota para buscar os dados do usuário que está logado. Precisa de token.
protectedUserRoutes.get('/me', (req, res) => {
  // @ts-expect-error - A propriedade 'user' é adicionada pelo middleware global
  return res.status(200).json({ user: req.user });
});

export { publicUserRoutes, protectedUserRoutes };

