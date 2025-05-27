import express, {Router} from "express";
import {authMiddleware} from "../middleware/auth-middleware";
import {UserController} from "../controller/user-controller";
import {BorrowingController} from "../controller/borrowing-controller";

export const authRouter: Router = express.Router();

authRouter.use(authMiddleware);

authRouter.patch("/api/users/current", UserController.reset);
authRouter.delete("/api/users/current", UserController.logout);

authRouter.post("/api/borrowings", BorrowingController.addBorrowRecord);
authRouter.get("/api/borrowings/history/:userId", BorrowingController.getBorrowedBookHistory);
authRouter.get("/api/borrowings/:borrowingId", BorrowingController.getBorrowingRecordById);


