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
import { camaRoutes } from './modules/camas/cama.routes.js';
import { ratePlanRoutes } from './modules/rate-plan/rate-plan.routes.js';
import { rateRuleRoutes } from './modules/rate-rule/rate-rule.routes.js';
import { childPolicyRoutes } from './modules/child-pricing-policy/child-pricing-policy.routes.js';
import { addonRoutes } from './modules/addons/addon.routes.js';
import { hospedeRoutes } from './modules/hospedes/hospede.routes.js';
import { reservaRoutes } from './modules/reservas/reserva.routes.js';
import { productCategoryRoutes } from './modules/product-categories/product-category.routes.js';
import { produtoRoutes } from './modules/produtos/produto.routes.js';
import { stockMovementRoutes } from './modules/stock-movements/stock-movement.routes.js';
import { supplierRoutes } from './modules/supplier/supplier.routes.js';
import { apCategoryRoutes } from './modules/ap-category/ap-category.routes.js';
import { apInvoiceRoutes } from './modules/ap-invoice/ap-invoice.routes.js';
import { cashAccountRoutes } from './modules/cash-account/cash-account.routes.js';
import { apPaymentRoutes } from './modules/ap-payment/ap-payment.routes.js';
import { folioRoutes } from './modules/folio/folio.routes.js';
import { paymentRoutes } from './modules/payment/payment.routes.js';
import { occupancyRoutes } from './modules/occupancy/occupancy.routes.js';

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
app.use('/api', camaRoutes);
app.use('/api', ratePlanRoutes);
app.use('/api', rateRuleRoutes);
app.use('/api', childPolicyRoutes);
app.use('/api', addonRoutes);
app.use('/api', hospedeRoutes);
app.use('/api', reservaRoutes);
app.use('/api', productCategoryRoutes);
app.use('/api', produtoRoutes);
app.use('/api', stockMovementRoutes);
app.use('/api', supplierRoutes);
app.use('/api', apCategoryRoutes);
app.use('/api', apInvoiceRoutes);
app.use('/api', apPaymentRoutes);
app.use('/api', cashAccountRoutes);
app.use('/api', folioRoutes);
app.use('/api', paymentRoutes);
app.use('/api', occupancyRoutes);

export { app };
