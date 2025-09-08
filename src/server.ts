// src/server.ts
import { app } from './app';
import 'dotenv/config'; // Carrega as variáveis de ambiente do .env

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});