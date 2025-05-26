import {AuthorTest, BookTest, BorrowingTest, CategoryTest, UserTest} from "./test-util";
import supertest from "supertest";
import {web} from "../src/application/web";
import {db} from "../src/application/database";

describe("POST /api/borrowings", () => {
    let adminAccessToken: string;
    let userAccessToken: string;
    let bookId: string;
    let userId: string;

    beforeEach(async () => {
        await UserTest.create();
        await UserTest.createAdmin();
        await BookTest.createBook();

        const adminLoginResponse = await supertest(web)
            .post('/api/users/login')
            .send({
                email: "admin@pens.ac.id",
                password: "admin123",
            });

        adminAccessToken = adminLoginResponse.body.data.accessToken;

        const userLoginResponse = await supertest(web)
            .post('/api/users/login')
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        userAccessToken = userLoginResponse.body.data.accessToken;

        const bookRecord = await BookTest.getBook();

        if (bookRecord) {
            bookId = bookRecord.isbn;
        }

        const userRecord = await UserTest.getUser();

        if (userRecord) {
            userId = userRecord.id;
        }
    });

    afterEach(async () => {
        await BorrowingTest.deleteBorrowing();
        await CategoryTest.deleteCategory();
        await AuthorTest.deleteAuthor();
        await BookTest.deleteBook();
        await UserTest.delete();
        await UserTest.deleteAdmin();
    });

    it("should reject borrow request if not logged in", async () => {
        const todayForBorrow = new Date();
        const tomorrowForReturn = new Date(todayForBorrow);
        tomorrowForReturn.setDate(todayForBorrow.getDate() + 1);

        const response = await supertest(web)
            .post('/api/borrowings')
            .send({
                bookId,
                borrowDate: todayForBorrow.toISOString(),
                returnDate: tomorrowForReturn.toISOString(),
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    it("should reject borrow request from the same user", async () => {
        const todayForBorrow = new Date();
        const tomorrowForReturn = new Date(todayForBorrow);
        tomorrowForReturn.setDate(todayForBorrow.getDate() + 1);

        await BorrowingTest.addBorrowing(bookId, userId, todayForBorrow, tomorrowForReturn);

        const response = await supertest(web)
            .post('/api/borrowings')
            .set("Authorization", `Bearer ${userAccessToken}`)
            .send({
                bookId,
                borrowDate: todayForBorrow.toISOString(),
                returnDate: tomorrowForReturn.toISOString(),
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("This book is already borrowed by the same user");

    });

    it("should reject borrow request from user if book not found", async () => {
        const todayForBorrow = new Date();
        const tomorrowForReturn = new Date(todayForBorrow);
        tomorrowForReturn.setDate(todayForBorrow.getDate() + 1);

        const response = await supertest(web)
            .post('/api/borrowings')
            .set("Authorization", `Bearer ${userAccessToken}`)
            .send({
                bookId: "wrong",
                borrowDate: todayForBorrow.toISOString(),
                returnDate: tomorrowForReturn.toISOString(),
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Book not found");

    });

    it("should reject borrow request from user if book unavailable", async () => {
        const todayForBorrow = new Date();
        const tomorrowForReturn = new Date(todayForBorrow);
        tomorrowForReturn.setDate(todayForBorrow.getDate() + 1);

        await UserTest.create("test2", undefined,"test2@pens.ac.id");

        await BorrowingTest.addBorrowing(bookId, "test2", todayForBorrow, tomorrowForReturn);

        const response = await supertest(web)
            .post('/api/borrowings')
            .set("Authorization", `Bearer ${userAccessToken}`)
            .send({
                bookId,
                borrowDate: todayForBorrow.toISOString(),
                returnDate: tomorrowForReturn.toISOString(),
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("This book currently borrowed by another user");

    });

    it("should reject borrow request from user if borrow date is invalid", async () => {
        const todayForBorrow = new Date();
        const tomorrowForReturn = new Date(todayForBorrow);
        tomorrowForReturn.setDate(todayForBorrow.getDate() + 1);

        const response = await supertest(web)
            .post('/api/borrowings')
            .set("Authorization", `Bearer ${userAccessToken}`)
            .send({
                bookId,
                returnDate: todayForBorrow.toISOString(),
                borrowDate: tomorrowForReturn.toISOString(),
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();

    });

    it("should be able to borrow a book as user", async () => {
        const todayForBorrow = new Date();
        const tomorrowForReturn = new Date(todayForBorrow);
        tomorrowForReturn.setDate(todayForBorrow.getDate() + 1);

        const response = await supertest(web)
            .post('/api/borrowings')
            .set("Authorization", `Bearer ${userAccessToken}`)
            .send({
                bookId,
                borrowDate: todayForBorrow.toISOString(),
                returnDate: tomorrowForReturn.toISOString(),
            });

        expect(response.status).toBe(201);
        expect(response.body.data.bookId).toBe(bookId);
        expect(response.body.data.title).toBe("title");
        expect(response.body.data.userId).toBeDefined();
        expect(response.body.data.name).toBe("test");
        expect(response.body.data.borrowDate).toBe(todayForBorrow.toISOString());
        expect(response.body.data.returnDate).toBe(tomorrowForReturn.toISOString());

        const book = await db.book.findUnique({
            where: {
                isbn: bookId,
            },
            select: {
                isAvailable: true,
            }
        });
        expect(book!.isAvailable).toBe(false);
    });

    it("should reject borrow request from admin if user not found", async () => {
        const todayForBorrow = new Date();
        const tomorrowForReturn = new Date(todayForBorrow);
        tomorrowForReturn.setDate(todayForBorrow.getDate() + 1);

        const response = await supertest(web)
            .post('/api/borrowings')
            .set("Authorization", `Bearer ${adminAccessToken}`)
            .send({
                userId: "wrong",
                bookId,
                borrowDate: todayForBorrow.toISOString(),
                returnDate: tomorrowForReturn.toISOString(),
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("User not found");

    });

    it("should reject borrow request from admin if request is invalid", async () => {
        const todayForBorrow = new Date();
        const tomorrowForReturn = new Date(todayForBorrow);
        tomorrowForReturn.setDate(todayForBorrow.getDate() + 1);

        const response = await supertest(web)
            .post('/api/borrowings')
            .set("Authorization", `Bearer ${adminAccessToken}`)
            .send({
                bookId,
                borrowDate: todayForBorrow.toISOString(),
                returnDate: tomorrowForReturn.toISOString(),
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();

    });

    it("should reject admin borrow book request", async () => {
        const todayForBorrow = new Date();
        const tomorrowForReturn = new Date(todayForBorrow);
        tomorrowForReturn.setDate(todayForBorrow.getDate() + 1);

        const response = await supertest(web)
            .post('/api/borrowings')
            .set("Authorization", `Bearer ${adminAccessToken}`)
            .send({
                userId: 'admin',
                bookId,
                borrowDate: todayForBorrow.toISOString(),
                returnDate: tomorrowForReturn.toISOString(),
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Administrator can't borrow a book");

    });

    it("should be able to add borrow record as admin", async () => {
        const todayForBorrow = new Date();
        const tomorrowForReturn = new Date(todayForBorrow);
        tomorrowForReturn.setDate(todayForBorrow.getDate() + 1);

        const response = await supertest(web)
            .post('/api/borrowings')
            .set("Authorization", `Bearer ${adminAccessToken}`)
            .send({
                userId,
                bookId,
                borrowDate: todayForBorrow.toISOString(),
                returnDate: tomorrowForReturn.toISOString(),
            });

        expect(response.status).toBe(201);
        expect(response.body.data.bookId).toBe(bookId);
        expect(response.body.data.title).toBe("title");
        expect(response.body.data.userId).toBeDefined();
        expect(response.body.data.name).toBe("test");
        expect(response.body.data.borrowDate).toBe(todayForBorrow.toISOString());
        expect(response.body.data.returnDate).toBe(tomorrowForReturn.toISOString());

        const book = await db.book.findUnique({
            where: {
                isbn: bookId,
            },
            select: {
                isAvailable: true,
            }
        });
        expect(book!.isAvailable).toBe(false);
    });
});

describe("PUT /api/borrowings/:borrowingId", () => {
    let adminAccessToken: string;
    let userAccessToken: string;
    let bookId: string;
    let userId: string;
    let borrowingId: number;
    const todayForBorrow = new Date();
    const tomorrowForReturn = new Date(todayForBorrow);
    tomorrowForReturn.setDate(todayForBorrow.getDate() + 1);

    beforeEach(async () => {
        await UserTest.create();
        await UserTest.createAdmin();
        await BookTest.createBook();

        const adminLoginResponse = await supertest(web)
            .post('/api/users/login')
            .send({
                email: "admin@pens.ac.id",
                password: "admin123",
            });

        adminAccessToken = adminLoginResponse.body.data.accessToken;

        const userLoginResponse = await supertest(web)
            .post('/api/users/login')
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        userAccessToken = userLoginResponse.body.data.accessToken;

        const bookRecord = await BookTest.getBook();

        if (bookRecord) {
            bookId = bookRecord.isbn;
        }

        const userRecord = await UserTest.getUser();

        if (userRecord) {
            userId = userRecord.id;
        }

        const borrowingRecord = await BorrowingTest.addBorrowing(bookId, userId, todayForBorrow, tomorrowForReturn);

        if (borrowingRecord) {
            borrowingId = borrowingRecord.id;
        }
    });

    afterEach(async () => {
        await BorrowingTest.deleteBorrowing();
        await CategoryTest.deleteCategory();
        await AuthorTest.deleteAuthor();
        await BookTest.deleteBook();
        await UserTest.delete();
        await UserTest.deleteAdmin();
    });

    it("should reject request to update return date of book if not logged in", async () => {
        const response = await supertest(web)
            .patch(`/api/borrowings/${borrowingId}`)
            .send({
                userId,
                bookId,
                borrowDate: todayForBorrow.toISOString(),
                returnDate: tomorrowForReturn.toISOString(),
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    it("should reject request to update return date of book if not admin", async () => {
        const response = await supertest(web)
            .patch(`/api/borrowings/${borrowingId}`)
            .set("Authorization", `Bearer ${userAccessToken}`)
            .send({
                userId,
                bookId,
                borrowDate: todayForBorrow.toISOString(),
                returnDate: tomorrowForReturn.toISOString(),
            });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe("You are not permitted to perform this action");
    });

    it("should reject request to update return date of book if record not found", async () => {
        const response = await supertest(web)
            .patch('/api/borrowings/0980')
            .set("Authorization", `Bearer ${adminAccessToken}`)
            .send({
                userId,
                bookId,
                borrowDate: todayForBorrow.toISOString(),
                returnDate: tomorrowForReturn.toISOString(),
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Corresponding borrow record is not found");
    });

    it("should be able to update return date of book as admin", async () => {
        const response = await supertest(web)
            .patch(`/api/borrowings/${borrowingId}`)
            .set("Authorization", `Bearer ${adminAccessToken}`)
            .send({
                userId,
                bookId,
                borrowDate: todayForBorrow.toISOString(),
                returnDate: tomorrowForReturn.toISOString(),
            });

        expect(response.status).toBe(200);
        expect(response.body.data.message).toBe("OK");
    });
});