import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Criar perfis
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

  console.log('✅ Profiles created:', profileManager.name, profileEmployee.name);

  // Criar usuário admin
  const hashPassword = await bcrypt.hash('admin', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@controlt.com' },
    update: {},
    create: {
      name: 'Adminstrador',
      email: 'admin@controlt.com',
      hash_password: hashPassword,
      profile_id: profileManager.id
    }
  });

  console.log('✅ Admin user created:', admin.email);
  console.log('📧 Email: admin@controlt.com');
  console.log('🔑 Password: admin');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });