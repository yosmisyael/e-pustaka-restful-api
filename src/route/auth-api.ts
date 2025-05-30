import express, {Router} from "express";
import {authMiddleware} from "../middleware/auth-middleware";
import {UserController} from "../controller/user-controller";
import {BorrowingController} from "../controller/borrowing-controller";

export const authRouter: Router = express.Router();

authRouter.use(authMiddleware);

authRouter.patch("/users/current", UserController.reset);
authRouter.delete("/users/current", UserController.logout);

// borrowings
authRouter.post("/borrowings", BorrowingController.addBorrowRecord);
authRouter.get("/borrowings/history/:userId", BorrowingController.getBorrowedBookHistory);
authRouter.get("/borrowings/:borrowingId", BorrowingController.getBorrowingRecordById);


