// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

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

  const statuses = [
    { name: 'Inbox', color: '#94A3B8' },
    { name: 'Processando', color: '#3B82F6' },
    { name: 'Próxima Ação', color: '#8B5CF6' },
    { name: 'Em Andamento', color: '#F59E0B' },
    { name: 'Aguardando', color: '#A855F7' },
    { name: 'Agendada', color: '#EC4899' },
    { name: 'Algum Dia', color: '#6366F1' },
    { name: 'Concluída', color: '#10B981' },
    { name: 'Cancelada', color: '#EF4444' },
    { name: 'Arquivada', color: '#6B7280' },
    { name: 'Bloqueada', color: '#DC2626' },
    { name: 'Em Revisão', color: '#0EA5E9' },
    { name: 'Referência', color: '#14B8A6' },
    { name: 'Projeto', color: '#8B5CF6' },
  ];

  for (const status of statuses) {
    await prisma.statusItem.upsert({
      where: { name: status.name },
      update: {},
      create: status,
    });
  }

  console.log('✅ Status de projetos criados');

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