// src/app.ts
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors()); // Permite requisições de outros domínios
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rota de teste para verificar se o servidor está no ar
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Bem-vindo à API do MorfeuApp!',
    version: '1.0.0',
    docs: '/api-docs' // Futuramente, o link para a documentação
  });
});

export { app };