import {CategoryTest, UserTest} from "./test-util";
import supertest from "supertest";
import {web} from "../src/application/web";

describe("POST /api/categories", () => {
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
        await UserTest.deleteAdmin();
        await UserTest.delete();
        await CategoryTest.deleteCategory();
    });

    it("should reject request to create category if not logged in", async () => {
        const response = await supertest(web)
            .post("/api/categories")
            .send({
                name: "habit",
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    it("should reject request to create category if not sent by admin", async () => {
        await UserTest.create();
        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        const response = await supertest(web)
            .post("/api/categories")
            .set("Authorization", `Bearer ${loginResponse.body.data.accessToken}`)
            .send({
                name: "habit",
            });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe("You are not permitted to perform this action");
    });

    it("should reject request to create category if category already exist", async () => {
        await CategoryTest.createCategory();

        const response = await supertest(web)
            .post("/api/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "test",
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Category already exists");
    });

    it("should be able to create a category", async () => {
        const response = await supertest(web)
            .post("/api/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "habit",
            });

        expect(response.status).toBe(201);
        expect(response.body.data.name).toBe("habit");
    });
});

describe("PATCH /api/categories/:categoryId", () => {
    let accessToken: string;
    let categoryId: number;

    beforeEach(async () => {
        await UserTest.createAdmin();

        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "admin@pens.ac.id",
                password: "admin123",
            });

        accessToken = loginResponse.body.data.accessToken;

        const categoryResponse = await supertest(web)
            .post("/api/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "test",
            });
        categoryId = categoryResponse.body.data.id;
    });

    afterEach(async () => {
        await CategoryTest.deleteCategory();
        await UserTest.deleteAdmin();
        await UserTest.delete();
    });

    it("should reject request to update category if not logged in", async () => {
        const response = await supertest(web)
            .patch(`/api/categories/${categoryId}`)
            .send({
                name: "habit",
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    it("should reject request to update category if not sent by admin", async () => {
        await UserTest.create();
        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        const response = await supertest(web)
            .patch(`/api/categories/${categoryId}`)
            .set("Authorization", `Bearer ${loginResponse.body.data.accessToken}`)
            .send({
                name: "habit",
            });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe("You are not permitted to perform this action");
    });

    it("should reject update category request if category already exists", async () => {
        await CategoryTest.createCategory("exist");
        const response = await supertest(web)
            .patch(`/api/categories/${categoryId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "exist",
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Category already exists");
    });

    it("should be able to update category with the same data", async () => {
        const response = await supertest(web)
            .patch(`/api/categories/${categoryId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "test",
            });
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("test");
    });

    it("should be able to update a category", async () => {
        const response = await supertest(web)
            .patch(`/api/categories/${categoryId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "habit",
            });

        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("habit");
    });
});

describe("DELETE /api/categories/:categoryId", () => {
    let accessToken: string;
    let categoryId: number;

    beforeEach(async () => {
        await UserTest.createAdmin();

        await CategoryTest.createCategory("exist");

        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "admin@pens.ac.id",
                password: "admin123",
            });

        accessToken = loginResponse.body.data.accessToken;

        const categoryResponse = await supertest(web)
            .post("/api/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "test",
            });

        categoryId = categoryResponse.body.data.id;
    });

    afterEach(async () => {
        await CategoryTest.deleteCategory();
        await UserTest.deleteAdmin();
        await UserTest.delete();
    });

    it("should reject request to delete category if not logged in", async () => {
        const response = await supertest(web)
            .delete(`/api/categories/${categoryId}`);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    it("should reject request to delete category if not sent by admin", async () => {
        await UserTest.create();
        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        const response = await supertest(web)
            .delete(`/api/categories/${categoryId}`)
            .set("Authorization", `Bearer ${loginResponse.body.data.accessToken}`);

        expect(response.status).toBe(403);
        expect(response.body.error).toBe("You are not permitted to perform this action");
    });

    it("should reject delete category request if not found", async () => {
        const response = await supertest(web)
            .delete('/api/categories/999')
            .set("Authorization", `Bearer ${accessToken}`);

        console.log(response.body)

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Category not found");
    });

    it("should be able to delete a category", async () => {
        const response = await supertest(web)
            .delete(`/api/categories/${categoryId}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.message).toBe("OK");
    });
});