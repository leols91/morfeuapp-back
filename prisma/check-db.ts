// prisma/check-db.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando teste de conexão com o banco de dados...');
  try {
    // Tenta fazer a query mais simples possível: buscar o primeiro usuário.
    // Se a tabela não existir ou a conexão falhar, isso vai gerar um erro.
    const user = await prisma.usuario.findFirst();

    if (user) {
      console.log('✅ Conexão bem-sucedida! Um usuário foi encontrado:', user);
    } else {
      console.log('✅ Conexão bem-sucedida! A tabela "usuario" existe, mas está vazia.');
    }
  } catch (error) {
    console.error('❌ Falha no teste de conexão!');
    console.error('O erro detalhado é:', error);
    process.exit(1); // Encerra o script com um código de erro
  } finally {
    // Garante que a conexão seja fechada, não importa o que aconteça.
    await prisma.$disconnect();
    console.log('Conexão com o banco de dados fechada.');
  }
}

main();