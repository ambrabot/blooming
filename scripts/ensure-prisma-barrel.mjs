// O barrel `lib/generated/prisma/index.ts` é manual (o generator `prisma-client`
// não cria um index). Ele é versionado, mas o upload/clean do build na Vercel pode
// não preservá-lo → `@/lib/generated/prisma` deixa de resolver. Recriamos o barrel
// após `prisma generate` (no buildCommand) pra garantir o entry da pasta.
import { writeFileSync, mkdirSync } from "node:fs";

const dir = "lib/generated/prisma";
mkdirSync(dir, { recursive: true });
writeFileSync(
  `${dir}/index.ts`,
  'export * from "./client";\nexport * from "./enums";\nexport * from "./models";\n',
);
console.log("✔ prisma barrel index.ts garantido");
