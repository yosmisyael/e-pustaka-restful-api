import supertest from "supertest";
import {web} from "../src/application/web";
import {AuthorTest, UserTest} from "./test-util";

describe("POST /api/authors", () => {
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
        await UserTest.deleteAdmin();
        await UserTest.delete();
    });

    it("should reject request to create author if not logged in", async () => {
        const response = await supertest(web)
            .post("/api/authors")
            .send({
                name: "test",
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    it("should reject request to create author if not sent by admin", async () => {
        await UserTest.create();
        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        const response = await supertest(web)
            .post("/api/authors")
            .set("Authorization", `Bearer ${loginResponse.body.data.accessToken}`)
            .send({
                name: "test",
            });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe("You are not permitted to perform this action");
    });

    it("should reject request to create author if category already exist", async () => {
        await AuthorTest.createAuthor();

        const response = await supertest(web)
            .post("/api/authors")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "test",
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Author already exists");
    });

    it("should be able to create a author", async () => {
        const response = await supertest(web)
            .post("/api/authors")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "test",
            });

        expect(response.status).toBe(201);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe("test");
    });
});

describe("PATCH /api/authors/:authorId", () => {
    let accessToken: string;
    let authorId: number;

    beforeEach(async () => {
        await UserTest.createAdmin();

        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "admin@pens.ac.id",
                password: "admin123",
            });

        accessToken = loginResponse.body.data.accessToken;

        await AuthorTest.createAuthor();

        const authorRecord = await AuthorTest.getAuthor();

        if (authorRecord) {
            authorId = authorRecord.id;
        }
    });

    afterEach(async () => {
        await AuthorTest.deleteAuthor();
        await UserTest.deleteAdmin();
        await UserTest.delete();
    });

    it("should reject request to update author if not logged in", async () => {
        const response = await supertest(web)
            .patch(`/api/authors/${authorId}`)
            .send({
                name: "habit",
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    it("should reject request to update author if not sent by admin", async () => {
        await UserTest.create();
        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        const response = await supertest(web)
            .patch(`/api/authors/${authorId}`)
            .set("Authorization", `Bearer ${loginResponse.body.data.accessToken}`)
            .send({
                name: "habit",
            });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe("You are not permitted to perform this action");
    });

    it("should reject request to update author if not found", async () => {
        const response = await supertest(web)
            .patch('/api/authors/9999')
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "test",
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Author not found");
    });

    it("should reject update author request if author already exists", async () => {
        await AuthorTest.createAuthor("exist");
        const response = await supertest(web)
            .patch(`/api/authors/${authorId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "exist",
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Author already exists");
    });

    it("should be able to update author with the same data", async () => {
        const response = await supertest(web)
            .patch(`/api/authors/${authorId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "test",
            });

        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("test");
    });

    it("should be able to update a author", async () => {
        const response = await supertest(web)
            .patch(`/api/authors/${authorId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "habit",
            });

        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("habit");
    });
});

describe("DELETE /api/authors/:authorId", () => {
    let accessToken: string;
    let authorId: number;

    beforeEach(async () => {
        await UserTest.createAdmin();

        await AuthorTest.createAuthor();

        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "admin@pens.ac.id",
                password: "admin123",
            });

        accessToken = loginResponse.body.data.accessToken;

        const authorRecord = await AuthorTest.getAuthor();

        if (authorRecord) {
            authorId = authorRecord.id;
        }
    });

    afterEach(async () => {
        await AuthorTest.deleteAuthor();
        await UserTest.deleteAdmin();
        await UserTest.delete();
    });

    it("should reject request to delete author if not logged in", async () => {
        const response = await supertest(web)
            .delete(`/api/authors/${authorId}`);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    it("should reject request to delete author if not sent by admin", async () => {
        await UserTest.create();
        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        const response = await supertest(web)
            .delete(`/api/authors/${authorId}`)
            .set("Authorization", `Bearer ${loginResponse.body.data.accessToken}`);

        expect(response.status).toBe(403);
        expect(response.body.error).toBe("You are not permitted to perform this action");
    });

    it("should reject delete author if not found", async () => {
        const response = await supertest(web)
            .delete('/api/authors/999')
            .set("Authorization", `Bearer ${accessToken}`);

        console.log(response.body)

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Author not found");
    });

    it("should be able to delete a author", async () => {
        const response = await supertest(web)
            .delete(`/api/authors/${authorId}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.message).toBe("OK");
    });
})