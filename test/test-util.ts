import {db} from "../src/application/database";
import bcrypt from "bcrypt";

export class UserTest {

    static async create(name: string = "test", password: string = "test1234", email: string = "test@pens.ac.id") {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.user.create({
            data: {
                name: name,
                id: name,
                password: hashedPassword,
                email: email,
                role: "STUDENT",
            }
        });
    }

    static async getUser() {
        return db.user.findFirst({
            where: {
                NOT: {
                    role: "ADMINISTRATOR",
                }
            }
        });
    }

    static async delete() {
        await db.user.deleteMany({});
    }

    static async createAdmin() {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await db.user.create({
            data: {
                name: "admin",
                id: "admin",
                password: hashedPassword,
                email: "admin@pens.ac.id",
                role: "ADMINISTRATOR",
            }
        });
    }

    static async deleteAdmin() {
        await db.user.deleteMany({
            where: {
                role: "ADMINISTRATOR",
            }
        });
    }
}

export class CategoryTest {
    static async createCategory(name: string = "test") {
        await db.category.create({
            data: {
                name: name,
            }
        });
    }

    static async deleteCategory() {
        await db.category.deleteMany({});
    }
}

export class BookTest {
    static async createBook() {
        return db.book.create({
            data: {
                isbn : "isbn",
                title : "title",
                description : "there",
                year: 2005,
                pages: 19,
                language: "Eng",
                cover: "https://image.com",
                author: {
                    connectOrCreate: {
                        where: { name: "me" },
                        create: { name: "me" },
                    }
                },
                category: {
                    connectOrCreate: {
                        where: { name: "test" },
                        create: { name: "test" },
                    }
                }
            }
        });
    }

    static async getBook() {
        return db.book.findFirst({});
    }

    static async deleteBook() {
        await db.book.deleteMany({});
    }
}

export class AuthorTest {
    static async createAuthor(name: string = "test") {
        await db.author.create({
            data: {
                name,
            },
        });
    }

    static async getAuthor(name: string = "test") {
        return db.author.findFirst({
            where: {
                name,
            },
            select: {
                id: true,
            }
        });
    }

    static async deleteAuthor() {
        await db.author.deleteMany({});
    }
}

export class BorrowingTest {
    static async addBorrowing(bookId: string, userId: string, borrowDate: Date, returnDate: Date) {
        return db.usersOnBooks.create({
            data: {
                bookId,
                userId,
                borrowDate,
                returnDate,
            },
            select: {
                id: true,
            },
        });
    }

    static async deleteBorrowing() {
        await db.usersOnBooks.deleteMany({});
    }
}