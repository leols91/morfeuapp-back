import { Router } from 'express';
import { createUserController } from './user.controller.js';

const userRoutes: Router = Router();

userRoutes.post('/users', createUserController);

userRoutes.get('/me', (req, res) => {
  // @ts-expect-error - A propriedade 'user' é adicionada pelo middleware global
  return res.status(200).json({ user: req.user });
});

export { userRoutes };
