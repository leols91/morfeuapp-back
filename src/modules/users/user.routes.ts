import { Router } from 'express';
import {
  createUserController,
  updateUserController,
  listUsersController, // Importa o novo controller
} from './user.controller.js';

// --- Rotas Públicas ---
const publicUserRoutes: Router = Router();
// A criação de usuários (cadastro) é pública
publicUserRoutes.post('/users', createUserController);

// --- Rotas Protegidas ---
const protectedUserRoutes: Router = Router();
// A rota para ver os próprios dados é protegida
protectedUserRoutes.get('/me', (req, res) => {
  // @ts-expect-error - A propriedade 'user' é adicionada pelo middleware global
  return res.status(200).json({ user: req.user });
});

// A rota para ATUALIZAR um usuário é protegida
protectedUserRoutes.patch('/users/:userId', updateUserController);

// A rota para LISTAR todos os usuários é protegida
protectedUserRoutes.get('/users', listUsersController);

export { publicUserRoutes, protectedUserRoutes };

