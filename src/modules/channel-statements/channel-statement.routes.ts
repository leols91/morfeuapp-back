    import { Router } from 'express';
    import * as statementController from './channel-statement.controller.js';

    const channelStatementRoutes: Router = Router();

    // Rotas aninhadas sob Canal de Venda
    channelStatementRoutes.post(
      '/sales-channels/:channelId/statements',
      statementController.createStatementController,
    );
    channelStatementRoutes.get(
      '/sales-channels/:channelId/statements',
      statementController.listStatementsController,
    );

    export { channelStatementRoutes };
    
