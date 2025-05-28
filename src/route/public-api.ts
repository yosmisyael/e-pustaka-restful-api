import express from "express";
import {UserController} from "../controller/user-controller";
import {BookController} from "../controller/book-controller";
import {AuthorController} from "../controller/author-controller";
import {CategoryController} from "../controller/category-controller";

export const publicRouter = express.Router();

publicRouter.post("/api/users", UserController.register);
publicRouter.post("/api/users/login", UserController.login);
publicRouter.post("/api/users/current/token", UserController.refreshToken);
publicRouter.get("/api/users/:userId", UserController.getUserById);

// books resources
publicRouter.get("/api/books/search", BookController.searchBooks);

// authors resources
publicRouter.get("/api/authors", AuthorController.getAllAuthors);
publicRouter.get("/api/authors/:authorId", AuthorController.getAuthorById);

// categories resources
publicRouter.get("/api/categories", CategoryController.getAllCategories);
publicRouter.get("/api/categories/:categoryId", CategoryController.getCategoryById);


