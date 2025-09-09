// src/modules/auth/auth.routes.ts
import { Router } from 'express';
import { loginController } from './auth.controller.js';

const authRoutes: Router = Router();

// Define a rota POST para /auth/login
authRoutes.post('/auth/login', loginController);

export { authRoutes };