import { Router } from 'express';
import * as userConfigController from './user-config.controller.js';

const userConfigRoutes: Router = Router();

// Usamos '/users/me' como um atalho para o usuário logado
userConfigRoutes.get(
  '/users/me/configs',
  userConfigController.listUserConfigsController,
);
userConfigRoutes.post(
  '/users/me/configs',
  userConfigController.upsertUserConfigController,
);

export { userConfigRoutes };

