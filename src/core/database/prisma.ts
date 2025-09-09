// src/core/database/prisma.ts

import { PrismaClient } from '@prisma/client';

// Cria uma única instância exportável do PrismaClient
export const prisma = new PrismaClient();