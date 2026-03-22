import fs from "fs";
import path from "path";

const dbProvider = process.argv[2] || "postgresql";

if (!["postgresql", "sqlite"].includes(dbProvider)) {
  console.error("❌ Invalid database provider. Use 'postgresql' or 'sqlite'");
  process.exit(1);
}

const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
const sourcePath = path.join(
  process.cwd(),
  "prisma",
  dbProvider === "sqlite" ? "schema.sqlite.prisma" : "schema.prisma.pg"
);

try {
  const content = fs.readFileSync(sourcePath, "utf-8");
  fs.writeFileSync(schemaPath, content);
  console.log(`✅ Switched to ${dbProvider}`);
} catch (error) {
  console.error(`❌ Failed to switch database: ${error}`);
  process.exit(1);
}
