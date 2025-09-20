    import type { Request, Response } from 'express';
    import * as statementService from './channel-statement.service.js';

    interface AuthRequest extends Request {
      user?: { id: string };
    }

    function handleError(res: Response, error: unknown, context: string) {
      console.error(`Erro em ${context}:`, error);
      if (error instanceof Error) {
        if (error.message.includes('Acesso negado')) {
          return res.status(403).json({ message: error.message });
        }
        if (error.message.includes('não encontrad')) {
          return res.status(404).json({ message: error.message });
        }
        if (error.message.includes('Nenhuma comissão') || error.message.includes('precisa estar associado')) {
            return res.status(400).json({ message: error.message });
        }
      }
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }

    export async function listStatementsController(req: AuthRequest, res: Response) {
      try {
        const userId = req.user?.id;
        const { channelId } = req.params;
        if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

        const statements = await statementService.listStatementsService(channelId, userId);
        return res.status(200).json(statements);
      } catch (error) {
        return handleError(res, error, 'listar extratos');
      }
    }

    export async function createStatementController(req: AuthRequest, res: Response) {
      try {
        const userId = req.user?.id;
        const { channelId } = req.params;
        if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

        const result = await statementService.createStatementService(req.body, channelId, userId);
        return res.status(201).json(result);
      } catch (error) {
        return handleError(res, error, 'criar extrato');
      }
    }
    
