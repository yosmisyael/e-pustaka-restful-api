import {Response, NextFunction} from 'express';
import {BorrowRequest, BorrowResponse} from "../model/borrowing-model";
import {UserRequest} from "../type/user-request";
import {roles} from "../../generated/prisma";
import {UserInfo} from "../model/user-model";
import {BorrowingService} from "../service/borrowing-service";
import {BookService} from "../service/book-service";

export class BorrowingController {
    static async getBorrowingRecordById(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const borrowingId: number = Number(req.params.borrowingId);

            const response = await BorrowingService.getBorrowingById(borrowingId);

            res.status(200).send({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getBorrowingList(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await BorrowingService.getAllBorrowingList();

            res.status(200).send({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }

    static async addBorrowRecord(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const user: UserInfo = req.user!;

            const request: BorrowRequest = req.body as BorrowRequest;

            if ((request.userId === undefined || request.userId === null) && req.user?.role !== roles.ADMINISTRATOR) {
                request.userId = user?.id;
            }

            const response: BorrowResponse = await BorrowingService.save(request);

            res.status(201).send({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }

    static async returnBorrowedBook(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const borrowingId: number = Number(req.params.borrowingId);

            const { bookId } = await BorrowingService.update(borrowingId);

            await BookService.update(bookId, { isAvailable: true });

            res.status(200).send({
                data: {
                    message: "OK",
                },
            });
        } catch (err) {
            next(err);
        }
    }

    static async getBorrowedBookHistory(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userId: string = req.params.userId;

            const response = await BorrowingService.getLoansByUserId(userId);

            res.status(200).send({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getLibraryStats(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await BorrowingService.getLoansData();

            res.status(200).send({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }
}