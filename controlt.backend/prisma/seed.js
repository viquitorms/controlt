// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Criar perfis de usuário
  const profileManager = await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Gerente'
    }
  });

  const profileEmployee = await prisma.profile.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Colaborador'
    }
  });

  console.log('✅ Perfis criados:', profileManager.name, profileEmployee.name);

  // Criar status de projetos
  const statuses_task = [
    { name: 'Inbox' },
    { name: 'Processando' },
    { name: 'Próxima Ação' },
    { name: 'Em Andamento' },
    { name: 'Aguardando' },
    { name: 'Agendada' },
    { name: 'Algum Dia' },
    { name: 'Concluída' },
    { name: 'Cancelada' },
    { name: 'Arquivada' },
    { name: 'Bloqueada' },
    { name: 'Em Revisão' },
    { name: 'Referência' },
    { name: 'Projeto' },
  ];

  for (const status of statuses_task) {
    await prisma.statusTask.upsert({
      where: { name: status.name },
      update: {},
      create: status,
    });
  }

  console.log('✅ Status de projetos criados');

  // Criar status de projetos
  const statuses_project = [
    { name: 'Não iniciado' },
    { name: 'Em Andamento' },
    { name: 'Concluído' },
  ];

  for (const status of statuses_project) {
    await prisma.statusProject.upsert({
      where: { name: status.name },
      update: {},
      create: status,
    });
  }

  console.log('✅ Status de projetos criados');

  // Criar prioridades de tarefas
  const priority_task = [
    { level: 1, name: 'Alta' },
    { level: 2, name: 'Média' },
    { level: 3, name: 'Baixa' },
  ];

  for (const priority of priority_task) {
    await prisma.priorityTask.upsert({
      where: { level: priority.level, name: priority.name },
      update: {},
      create: priority,
    });
  }

  console.log('✅ Prioridades de tarefas criadas');

  // Criar usuário admin
  const hashPassword = await bcrypt.hash('admin', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@controlt.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@controlt.com',
      hash_password: hashPassword,
      profile_id: profileManager.id
    }
  });

  console.log('✅ Admin criado:', admin.email);
  console.log('📧 Email: admin@controlt.com');
  console.log('🔑 Senha: admin');
  console.log('🎉 Seed completado!');
}

main()
  .catch((e) => {
    console.error('❌ Seed erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });