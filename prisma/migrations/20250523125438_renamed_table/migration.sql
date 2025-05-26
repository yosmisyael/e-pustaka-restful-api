/*
  Warnings:

  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersOnBooks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UsersOnBooks` DROP FOREIGN KEY `UsersOnBooks_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `UsersOnBooks` DROP FOREIGN KEY `UsersOnBooks_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `books` DROP FOREIGN KEY `books_authorId_fkey`;

-- DropIndex
DROP INDEX `books_authorId_fkey` ON `books`;

-- DropTable
DROP TABLE `Author`;

-- DropTable
DROP TABLE `UsersOnBooks`;

-- CreateTable
CREATE TABLE `authors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `borrowing` (
    `user_id` VARCHAR(191) NOT NULL,
    `book_id` VARCHAR(191) NOT NULL,
    `borrowDate` DATETIME(3) NOT NULL,
    `returnDate` DATETIME(3) NOT NULL,
    `actual_return_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`, `book_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `books` ADD CONSTRAINT `books_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `authors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrowing` ADD CONSTRAINT `borrowing_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrowing` ADD CONSTRAINT `borrowing_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books`(`isbn`) ON DELETE RESTRICT ON UPDATE CASCADE;
