-- DropForeignKey
ALTER TABLE `borrowing` DROP FOREIGN KEY `borrowing_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `borrowing` DROP FOREIGN KEY `borrowing_user_id_fkey`;

-- DropIndex
DROP INDEX `borrowing_book_id_fkey` ON `borrowing`;

-- DropIndex
DROP INDEX `borrowing_user_id_fkey` ON `borrowing`;

-- AddForeignKey
ALTER TABLE `borrowing` ADD CONSTRAINT `borrowing_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrowing` ADD CONSTRAINT `borrowing_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books`(`isbn`) ON DELETE CASCADE ON UPDATE CASCADE;
