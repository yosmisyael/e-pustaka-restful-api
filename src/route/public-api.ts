import express from "express";
import {UserController} from "../controller/user-controller";
import {BookController} from "../controller/book-controller";
import {AuthorController} from "../controller/author-controller";
import {CategoryController} from "../controller/category-controller";

export const publicRouter = express.Router();

publicRouter.post("/users", UserController.register);
publicRouter.post("/users/login", UserController.login);
publicRouter.post("/users/current/token", UserController.refreshToken);
publicRouter.get("/users/:userId", UserController.getUserById);

publicRouter.get("/books/search", BookController.searchBooks);

publicRouter.get("/authors", AuthorController.getAllAuthors);
publicRouter.get("/authors/:authorId", AuthorController.getAuthorById);

publicRouter.get("/categories", CategoryController.getAllCategories);
publicRouter.get("/categories/:categoryId", CategoryController.getCategoryById);


