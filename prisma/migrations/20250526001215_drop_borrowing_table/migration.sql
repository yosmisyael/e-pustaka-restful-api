/*
  Warnings:

  - You are about to drop the `borrowing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `borrowing` DROP FOREIGN KEY `borrowing_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `borrowing` DROP FOREIGN KEY `borrowing_user_id_fkey`;

-- DropTable
DROP TABLE `borrowing`;
