import express, {Router} from "express";
import {authorizeRoleMiddleware} from "../middleware/authorize-role-middleware";
import {authMiddleware} from "../middleware/auth-middleware";
import {CategoryController} from "../controller/category-controller";
import {BookController} from "../controller/book-controller";
import {AuthorController} from "../controller/author-controller";
import {BorrowingController} from "../controller/borrowing-controller";

export const adminRouter: Router = express.Router();

adminRouter.use(authMiddleware);
adminRouter.use(authorizeRoleMiddleware)

// categories
adminRouter.get("/categories/search", CategoryController.searchCategory);
adminRouter.post("/categories", CategoryController.addCategory);
adminRouter.patch("/categories/:categoryId", CategoryController.updateCategory);
adminRouter.delete("/categories/:categoryId", CategoryController.deleteCategory);

// books
adminRouter.post("/books", BookController.addBook);
adminRouter.patch("/books/:bookId", BookController.updateBook);
adminRouter.delete("/books/:bookId", BookController.deleteBook);

// authors
adminRouter.post("/authors", AuthorController.addAuthor);
adminRouter.patch("/authors/:authorId", AuthorController.updateAuthor);
adminRouter.delete("/authors/:authorId", AuthorController.deleteAuthor);
adminRouter.get("/authors/search", AuthorController.searchAuthor);

// borrowings
adminRouter.get("/borrowings", BorrowingController.getBorrowingList);
adminRouter.get("/borrowings/library/stats", BorrowingController.getLibraryStats);
adminRouter.patch("/borrowings/:borrowingId", BorrowingController.returnBorrowedBook);
