-- DropForeignKey
ALTER TABLE `books` DROP FOREIGN KEY `books_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `books` DROP FOREIGN KEY `books_categoryId_fkey`;

-- DropIndex
DROP INDEX `books_authorId_fkey` ON `books`;

-- DropIndex
DROP INDEX `books_categoryId_fkey` ON `books`;

-- AddForeignKey
ALTER TABLE `books` ADD CONSTRAINT `books_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `authors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `books` ADD CONSTRAINT `books_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
