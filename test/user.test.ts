import supertest from "supertest";
import {web} from "../src/application/web";
import {UserTest} from "./test-util";

describe("POST /api/users", () => {

    afterEach(async () => {
        await UserTest.delete();
    });

    it("should reject registration if request is invalid", async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                id: "",
                email: "",
                password: "",
                name: ""
            });

        expect(response.status).toBe(400);
        expect(response.error).toBeDefined();
    });

    it("should reject registration if email already used", async () => {
        await UserTest.create();
        const response = await supertest(web)
            .post("/api/users")
            .send({
                id: "sss",
                email: "test@pens.ac.id",
                password: "test1234",
                name: "test",
            });

        console.log(response.body)
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Email already used");
    });

    it("should register new user", async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                id: "sss",
                email: "test@pens.ac.id",
                password: "test1234",
                name: "test",
            });

        expect(response.status).toBe(201);
        expect(response.body.data.email).toBe("test@pens.ac.id");
    });
});

describe("POST /api/users/login", () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it("should reject login request if email is invalid", async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "wrong@pens.ac.id",
                password: "test1234",
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Email or password is wrong");
    });

    it("should reject login request if password is invalid", async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "wrongwrong",
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Email or password is wrong");
    });

    it("should be able to login", async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        expect(response.status).toBe(200);
        expect(response.body.data.accessToken).toBeDefined();
        expect(response.body.data.refreshToken).toBeDefined();
    });
});

describe("PATCH /api/users/current", () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it("should reject reset password request if current password does not match", async () => {
        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        const response = await supertest(web)
            .patch("/api/users/current")
            .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)
            .send({
                currentPassword: "wrongwrong",
                newPassword: "test4321",
                confirmPassword: "test4321",
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Password does not match");
    });

    it("should reject reset password request if new password does not match with confirm password field", async () => {
        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        const response = await supertest(web)
            .patch("/api/users/current")
            .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)
            .send({
                currentPassword: "test1234",
                newPassword: "test4321",
                confirmPassword: "test1234",
            });

        expect(response.status).toBe(400);
        expect(response.body.error[0].confirmPassword).toBe("Password does not match");
    });

    it("should be able to reset password", async () => {
        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        const response = await supertest(web)
            .patch("/api/users/current")
            .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)
            .send({
                currentPassword: "test1234",
                newPassword: "test4321",
                confirmPassword: "test4321",
            });

        expect(response.status).toBe(200);
        expect(response.body.data.message).toBe("Your password has been successfully reset, please log in again using your new credentials");
    });
});

describe("POST /api/users/current/token", () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it("should reject invalid refresh token request", async () => {
        const response = await supertest(web)
            .post("/api/users/current/token")
            .send({
                refreshToken: "wrong",
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });

    it("should be able to refresh user token", async () => {
        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        const response = await supertest(web)
            .post("/api/users/current/token")
            .send({
                refreshToken: loginResponse.body.data.refreshToken,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.accessToken).toBeDefined();
        expect(response.body.data.refreshToken).toBeDefined();
    });
});

describe("DELETE /api/users/current", () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it("should reject logout request if it is unauthorized", async () => {
        const response = await supertest(web)
            .post("/api/users/current")
            .send({
                accessToken: "wrong",
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    it("should be able to login", async () => {
        const loginResponse = await supertest(web)
            .post("/api/users/login")
            .send({
                email: "test@pens.ac.id",
                password: "test1234",
            });

        const response = await supertest(web)
            .delete("/api/users/current")
            .set("Authorization", `Bearer ${loginResponse.body.data.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.message).toBe("OK");
    });
});