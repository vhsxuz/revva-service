-- CreateTable
CREATE TABLE "Items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MenuCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "menu_category_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "production_cost" INTEGER NOT NULL,
    "margin" INTEGER NOT NULL,
    "monthly_revenue" INTEGER NOT NULL,
    "monthly_profit" INTEGER NOT NULL,
    "stock_serving" INTEGER NOT NULL,
    "prep_time_minutes" INTEGER NOT NULL,
    "last_restocked" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Items_id_key" ON "Items"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MenuCategory_id_key" ON "MenuCategory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_id_key" ON "Menu"("id");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_menu_category_id_fkey" FOREIGN KEY ("menu_category_id") REFERENCES "MenuCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
