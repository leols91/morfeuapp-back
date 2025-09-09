import express from 'express';
import type { Express } from 'express';
import cors from 'cors';

// Middlewares
import { authMiddleware } from './core/middlewares/auth.middleware.js';

// Importadores de Rota
import { authRoutes } from './modules/auth/auth.routes.js';
// Importamos as rotas de usuário que foram separadas
import {
  publicUserRoutes,
  protectedUserRoutes,
} from './modules/users/user.routes.js';
import { pousadaRoutes } from './modules/pousadas/pousada.routes.js';
import { roomTypeRoutes } from './modules/room-types/room-type.routes.js';
import { quartoRoutes } from './modules/quartos/quarto.routes.js';

const app: Express = express();

// Middlewares Globais Iniciais
app.use(cors());
app.use(express.json());

// Rota de Status (pública, opcional)
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Bem-vindo à API do MorfeuApp!',
    version: '1.0.0',
  });
});

// --- ROTAS PÚBLICAS ---
// Rotas registradas ANTES do middleware de proteção.
app.use('/api', authRoutes); // Login
app.use('/api', publicUserRoutes); // Cadastro de usuário

// --- MIDDLEWARE DE AUTENTICAÇÃO GLOBAL ---
// A partir deste ponto, todas as rotas abaixo exigirão um token JWT válido.
app.use(authMiddleware);

// --- ROTAS PROTEGIDAS ---
// Rotas registradas APÓS o middleware de proteção.
app.use('/api', protectedUserRoutes); // Rota /me
app.use('/api', pousadaRoutes);
app.use('/api', roomTypeRoutes);
app.use('/api', quartoRoutes);

export { app };

