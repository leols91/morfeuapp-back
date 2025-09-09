import express from 'express';
import type { Express } from 'express';
import cors from 'cors';

// Middlewares
import { authMiddleware } from './core/middlewares/auth.middleware.js';

// Importadores de Rota
import { authRoutes } from './modules/auth/auth.routes.js';
import { userRoutes } from './modules/users/user.routes.js';

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
// Todas as rotas de autenticação são registradas ANTES do middleware de proteção.
app.use('/api', authRoutes);


// --- MIDDLEWARE DE AUTENTICAÇÃO GLOBAL ---
// A partir deste ponto, todas as rotas exigirão um token JWT válido.
app.use(authMiddleware);


// --- ROTAS PROTEGIDAS ---
// Todas as rotas abaixo são automaticamente protegidas pelo middleware acima.
app.use('/api', userRoutes);


export { app };
