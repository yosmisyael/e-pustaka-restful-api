-- CreateTable
CREATE TABLE `borrowing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `book_id` VARCHAR(191) NOT NULL,
    `borrowDate` DATETIME(3) NOT NULL,
    `returnDate` DATETIME(3) NOT NULL,
    `actual_return_date` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `borrowing` ADD CONSTRAINT `borrowing_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrowing` ADD CONSTRAINT `borrowing_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books`(`isbn`) ON DELETE RESTRICT ON UPDATE CASCADE;
