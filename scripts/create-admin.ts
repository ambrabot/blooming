/**
 * Cria um usuário admin no banco de dados.
 * Uso: DATABASE_URL="..." npx tsx scripts/create-admin.ts
 * Ou:  npm run db:create-admin (após configurar o .env)
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as readline from "readline";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log("\n🌿 BLOOMING — Criar usuário admin\n");

  const name = await prompt("Nome: ");
  const email = await prompt("Email: ");
  const password = await prompt("Senha (mín. 8 chars): ");

  if (password.length < 8) {
    console.error("❌ Senha muito curta");
    process.exit(1);
  }

  const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    console.error("❌ Email já cadastrado");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hash,
      role: "ADMIN",
      profile: { create: {} },
    },
  });

  console.log(`\n✅ Admin criado com sucesso!`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Role:  ${user.role}`);
  console.log(`\n   Acesse: /admin\n`);

  await db.$disconnect();
}

main().catch((err) => {
  console.error("❌ Erro:", err.message);
  process.exit(1);
});
