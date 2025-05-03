import { remember } from "@epic-web/remember";
import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const prisma = remember("prisma-client", () => {
  const isProd = process.env.NODE_ENV === "production";
  const logThreshold = 20;

  const client = new PrismaClient({
    log: isProd
      ? ["error"]
      : [
          { level: "query", emit: "event" },
          { level: "error", emit: "stdout" },
          { level: "warn", emit: "stdout" },
        ],
  });

  if (!isProd) {
    client.$on("query", (e: { duration: number; query: any }) => {
      if (e.duration < logThreshold) return;
      const color =
        e.duration < logThreshold * 1.1
          ? "green"
          : e.duration < logThreshold * 1.2
          ? "blue"
          : e.duration < logThreshold * 1.3
          ? "yellow"
          : e.duration < logThreshold * 1.4
          ? "redBright"
          : "red";
      const dur = chalk[color](`${e.duration}ms`);
      console.info(`prisma:query - ${dur} - ${e.query}`);
    });
  }

  void client.$connect();
  return client;
});
