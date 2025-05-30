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

// categories resource
adminRouter.post("/api/categories", CategoryController.addCategory);
adminRouter.patch("/api/categories/:categoryId", CategoryController.updateCategory);
adminRouter.delete("/api/categories/:categoryId", CategoryController.deleteCategory);

// books resource
adminRouter.post("/api/books", BookController.addBook);
adminRouter.patch("/api/books/:bookId", BookController.updateBook);
adminRouter.delete("/api/books/:bookId", BookController.deleteBook);

// authors resource
adminRouter.post("/api/authors", AuthorController.addAuthor);
adminRouter.patch("/api/authors/:authorId", AuthorController.updateAuthor);
adminRouter.delete("/api/authors/:authorId", AuthorController.deleteAuthor);
adminRouter.get("/api/authors/search", AuthorController.searchAuthor);

// borrowings resource
adminRouter.get("/api/borrowings", BorrowingController.getBorrowingList);
adminRouter.get("/api/borrowings/library/stats", BorrowingController.getLibraryStats);
adminRouter.patch("/api/borrowings/:borrowingId", BorrowingController.returnBorrowedBook);
