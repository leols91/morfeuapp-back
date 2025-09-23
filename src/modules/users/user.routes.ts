import { Router } from 'express';
import {
  createUserController,
  deleteUserController,
  getMeController,
  inviteUserController,
  listUsersController,
  updatePasswordController,
  updateUserController,
} from './user.controller.js';

// --- ROTAS PÚBLICAS ---
// Rota para um novo usuário se cadastrar no sistema (sign-up)
export const publicUserRoutes: Router = Router();
publicUserRoutes.post('/users', createUserController);

// --- ROTAS PROTEGIDAS ---
// Exigem que o usuário esteja autenticado para serem acessadas
export const protectedUserRoutes: Router = Router();

// Rotas para o próprio usuário logado
protectedUserRoutes.get('/users/me', getMeController);
protectedUserRoutes.patch('/users/me/password', updatePasswordController);

// Rotas de gestão (geralmente para administradores)
protectedUserRoutes.get('/users', listUsersController);
protectedUserRoutes.patch('/users/:userId', updateUserController);
protectedUserRoutes.delete('/users/:userId', deleteUserController);

// Rota para um usuário logado convidar um novo usuário para uma pousada específica
protectedUserRoutes.post('/pousadas/:pousadaId/users', inviteUserController);

