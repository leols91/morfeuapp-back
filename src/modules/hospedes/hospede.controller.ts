    import type { Request, Response } from 'express';
    import {
    createHospedeService,
    deleteHospedeService,
    getHospedeByIdService,
    listHospedesService,
    updateHospedeService,
    } from './hospede.service.js';

    interface AuthRequest extends Request {
    user?: { id: string };
    }

    // Função genérica para tratar erros e evitar repetição
    function handleError(res: Response, error: unknown, context: string) {
    console.error(`Erro em ${context}:`, error);
    if (error instanceof Error) {
        if (error.message.includes('Acesso negado')) {
        return res.status(403).json({ message: error.message });
        }
        if (error.message.includes('não encontrad')) { // Cobre "encontrado" e "encontrada"
        return res.status(404).json({ message: error.message });
        }
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
    }

    export async function listHospedesController(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        const { pousadaId } = req.params;
        if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

        const hospedes = await listHospedesService(pousadaId, userId);
        return res.status(200).json(hospedes);
    } catch (error) {
        return handleError(res, error, 'listar hóspedes');
    }
    }

    export async function getHospedeByIdController(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        const { hospedeId } = req.params;
        if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

        const hospede = await getHospedeByIdService(hospedeId, userId);
        return res.status(200).json(hospede);
    } catch (error) {
        return handleError(res, error, 'buscar hóspede');
    }
    }

    export async function createHospedeController(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        const { pousadaId } = req.params;
        if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

        const hospede = await createHospedeService(req.body, pousadaId, userId);
        return res.status(201).json(hospede);
    } catch (error) {
        return handleError(res, error, 'criar hóspede');
    }
    }

    export async function updateHospedeController(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        const { hospedeId } = req.params;
        if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

        const hospede = await updateHospedeService(hospedeId, req.body, userId);
        return res.status(200).json(hospede);
    } catch (error) {
        return handleError(res, error, 'atualizar hóspede');
    }
    }

    export async function deleteHospedeController(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        const { hospedeId } = req.params;
        if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

        await deleteHospedeService(hospedeId, userId);
        return res.status(204).send();
    } catch (error) {
        return handleError(res, error, 'deletar hóspede');
    }
    }
