import {AuthorTest, BookTest, CategoryTest, UserTest} from "./test-util";
import supertest from "supertest";
import {web} from "../src/application/web";

describe("POST /api/books", () => {
    let accessToken: string;

    beforeEach(async () => {
        await UserTest.createAdmin();
        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "admin@pens.ac.id",
                password: "admin123",
            });
        accessToken = loginResponse.body.data.accessToken;
    });

    afterEach(async () => {
        await AuthorTest.deleteAuthor();
        await CategoryTest.deleteCategory();
        await UserTest.deleteAdmin();
        await UserTest.delete();
        await BookTest.deleteBook();
    });

    it("should reject request to add book if not logged in", async () => {
        const response = await supertest(web)
            .post("/api/books")
            .send({
                title: "habit",
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    it("should reject request to add book if not sent by admin", async () => {
        await UserTest.create();
        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        const response = await supertest(web)
            .post("/api/books")
            .set("Authorization", `Bearer ${loginResponse.body.data.accessToken}`)
            .send({
                title: "habit",
            });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe("You are not permitted to perform this action");
    });

    it("should reject request to add book if title is empty", async () => {
        const response = await supertest(web)
            .post("/api/books")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                isbn : "...",
                title : "",
                description : "book description",
                year: 2005,
                pages: 123,
                language: "Indonesia",
                cover: "https://image.com",
                author: "author",
                category: "category"
            });

        console.log(response.body)
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Title must not be empty");
    });

    it("should reject request to add book if isbn is empty", async () => {
        const response = await supertest(web)
            .post("/api/books")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                isbn : "",
                title : "title",
                description : "book description",
                year: 2005,
                pages: 123,
                language: "Indonesia",
                cover: "https://image.com",
                author: "author",
                category: "category"
            });

        console.log(response.body)
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("ISBN must not be empty");
    });

    it("should reject request to add book if description is empty", async () => {
        const response = await supertest(web)
            .post("/api/books")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                isbn : "isbn",
                title : "title",
                description : "",
                year: 2005,
                pages: 123,
                language: "Indonesia",
                cover: "https://image.com",
                author: "author",
                category: "category"
            });

        console.log(response.body)
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Description must not be empty");
    });

    it("should reject request to add book if published year is invalid", async () => {
        const response = await supertest(web)
            .post("/api/books")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                isbn : "isbn",
                title : "title",
                description : "there",
                year: -2005,
                pages: 19,
                language: "Indonesia",
                cover: "https://image.com",
                author: "author",
                category: "category"
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid year value");
    });

    it("should reject request to add book if number of pages is invalid", async () => {
        const response = await supertest(web)
            .post("/api/books")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                isbn : "isbn",
                title : "title",
                description : "there",
                year: 2005,
                pages: -19,
                language: "Indonesia",
                cover: "https://image.com",
                author: "author",
                category: "category"
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid number of pages");
    });

    it("should reject request to add book if language is empty", async () => {
        const response = await supertest(web)
            .post("/api/books")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                isbn : "isbn",
                title : "title",
                description : "there",
                year: 2005,
                pages: 19,
                language: "",
                cover: "https://image.com",
                author: "author",
                category: "category"
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Language must not be empty");
    });

    it("should reject request to add book if author is empty", async () => {
        const response = await supertest(web)
            .post("/api/books")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                isbn : "isbn",
                title : "title",
                description : "there",
                year: 2005,
                pages: 19,
                language: "Eng",
                cover: "https://image.com",
                author: "",
                category: "category"
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Author must not be empty");
    });

    it("should reject request to  add a book if book already exist", async () => {
        await BookTest.createBook();

        const response = await supertest(web)
            .post("/api/books")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                isbn : "isbn",
                title : "title",
                description : "there",
                year: 2005,
                pages: 19,
                language: "Eng",
                cover: "https://image.com",
                author: "me",
                category: "category"
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Book already exist");
    });

    it("should be able to add a book", async () => {
        const response = await supertest(web)
            .post("/api/books")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                isbn : "isbn",
                title : "title",
                description : "there",
                year: 2005,
                pages: 19,
                language: "Eng",
                cover: "https://image.com",
                author: "me",
                category: "category"
            });

        expect(response.status).toBe(201);
        expect(response.body.data.isbn).toBe("isbn");
        expect(response.body.data.title).toBe("title");
    });
});

describe("PUT /api/books/:bookId", () => {
    let accessToken: string;

    beforeEach(async () => {
        await UserTest.createAdmin();
        await BookTest.createBook();
        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "admin@pens.ac.id",
                password: "admin123",
            });
        accessToken = loginResponse.body.data.accessToken;
    });

    afterEach(async () => {
        await AuthorTest.deleteAuthor();
        await CategoryTest.deleteCategory();
        await UserTest.deleteAdmin();
        await UserTest.delete();
        await BookTest.deleteBook();
    });

    it("should reject update book request if not logged in", async () => {
        const existingBookId = await BookTest.getBook();

        const response = await supertest(web)
            .patch(`/api/books/${existingBookId?.isbn}`)
            .send({
                isAvailable: false,
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    it("should reject update book request if not sent by admin", async () => {
        const existingBookId = await BookTest.getBook();

        await UserTest.create();

        const userLoginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        const response = await supertest(web)
            .patch(`/api/books/${existingBookId?.isbn}`)
            .set("Authorization", `Bearer ${userLoginResponse.body.data.accessToken}`)
            .send({
                isAvailable: false,
            });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe("You are not permitted to perform this action");
    });

    it("should be able to update book title", async () => {
        const existingBookId = await BookTest.getBook();

        const response = await supertest(web)
            .patch(`/api/books/${existingBookId?.isbn}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: "new title",
            });

        expect(response.status).toBe(200);
        expect(response.body.data.title).toBe("new title");
        expect(response.body.data.isbn).toBe(existingBookId?.isbn);
    });

    it("should be able to update book year", async () => {
        const existingBookId = await BookTest.getBook();

        const response = await supertest(web)
            .patch(`/api/books/${existingBookId?.isbn}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                year: 2014,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.year).toBe(2014);
    });

    it("should be able to update book description", async () => {
        const existingBookId = await BookTest.getBook();

        const response = await supertest(web)
            .patch(`/api/books/${existingBookId?.isbn}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                description: "new description",
            });

        expect(response.status).toBe(200);
        expect(response.body.data.description).toBe("new description");
    });

    it("should be able to update book number of pages", async () => {
        const existingBookId = await BookTest.getBook();

        const response = await supertest(web)
            .patch(`/api/books/${existingBookId?.isbn}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                pages: 300,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.pages).toBe(300);
    });

    it("should be able to update book cover", async () => {
        const existingBookId = await BookTest.getBook();

        const response = await supertest(web)
            .patch(`/api/books/${existingBookId?.isbn}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                cover: "https://undraw.com",
            });

        expect(response.status).toBe(200);
        expect(response.body.data.cover).toBe("https://undraw.com");
    });

    it("should be able to update book language", async () => {
        const existingBookId = await BookTest.getBook();

        const response = await supertest(web)
            .patch(`/api/books/${existingBookId?.isbn}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                language: "japan",
            });

        expect(response.status).toBe(200);
        expect(response.body.data.language).toBe("japan");
    });

    it("should be able to update book availability", async () => {
        const existingBookId = await BookTest.getBook();

        const response = await supertest(web)
            .patch(`/api/books/${existingBookId?.isbn}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                isAvailable: false,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.isAvailable).toBe(false);
    });
});

describe("DELETE /api/books/:bookId", () => {
    let accessToken: string;

    beforeEach(async () => {
        await UserTest.createAdmin();
        await BookTest.createBook();
        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "admin@pens.ac.id",
                password: "admin123",
            });
        accessToken = loginResponse.body.data.accessToken;
    });

    afterEach(async () => {
        await AuthorTest.deleteAuthor();
        await CategoryTest.deleteCategory();
        await UserTest.deleteAdmin();
        await UserTest.delete();
        await BookTest.deleteBook();
    });

    it("should reject request to delete a book if not logged in", async () => {
        const response = await supertest(web)
            .delete('/api/books/wrong');

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    it("should reject request to delete a book if not sent by admin", async () => {
        await UserTest.create();
        const userLoginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        const response = await supertest(web)
            .delete('/api/books/wrong')
            .set("Authorization", `Bearer ${userLoginResponse.body.data.accessToken}`);

        expect(response.status).toBe(403);
        expect(response.body.error).toBe("You are not permitted to perform this action");
    });

    it("should reject request to delete a book if not exist", async () => {
        const existingBookId = await BookTest.getBook();

        const response = await supertest(web)
            .delete('/api/books/wrong')
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Book not found");
    });

    it("should reject request to delete a book if not exist", async () => {
        const response = await supertest(web)
            .delete('/api/books/wrong')
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Book not found");
    });

    it("should be able to delete a book", async () => {
        const existingBookId = await BookTest.getBook();

        const response = await supertest(web)
            .delete(`/api/books/${existingBookId?.isbn}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.message).toBe("OK");
    });
});