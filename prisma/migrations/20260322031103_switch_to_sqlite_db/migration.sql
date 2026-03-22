-- CreateTable
CREATE TABLE "m_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "t_budgets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "period_start" DATETIME NOT NULL,
    "period_end" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "t_budgets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "m_users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "t_transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "budget_id" INTEGER NOT NULL,
    "estimate_price" DECIMAL NOT NULL,
    "real_price" DECIMAL NOT NULL,
    "diff_price" DECIMAL,
    "qty" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "t_transactions_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "t_budgets" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "m_users_username_key" ON "m_users"("username");
