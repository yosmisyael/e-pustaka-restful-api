/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `authors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `books` MODIFY `is_available` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX `authors_name_key` ON `authors`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `categories_name_key` ON `categories`(`name`);
