/*
  Warnings:

  - Added the required column `rating` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "rating" DECIMAL(65,30) NOT NULL;
