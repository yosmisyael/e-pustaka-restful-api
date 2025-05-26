import {BorrowRequest, BorrowResponse, PrismaBorrowResult, toBorrowResponse} from "../model/borrowing-model";
import {db} from "../application/database";
import {Validation} from "../validation/validation";
import {BorrowingValidation} from "../validation/borrowing-validation";
import {ResponseError} from "../error/response-error";
import {roles} from "../../generated/prisma";

export class BorrowingService {
    static async verifyBookExists(bookId: string) {
        const bookRecord = await db.book.findUnique({
            where: {
                isbn: bookId,
            },
        });

        if (!bookRecord) {
            throw new ResponseError(404, "Book not found");
        }
    }

    static async getCurrentLoan(bookId: string) {
        return db.usersOnBooks.findFirst({
            where: {
                bookId,
                returnedDate: null,
            }
        });
    }

    static async save(req: BorrowRequest): Promise<BorrowResponse> {
        const request: BorrowRequest = Validation.validate(BorrowingValidation.CREATE, req);

        const currentLoan = await this.getCurrentLoan(req.bookId);

        if (currentLoan) {
            if (currentLoan.userId == req.userId) {
                throw new ResponseError(400, "This book is already borrowed by the same user");
            } else {
                throw new ResponseError(400, "This book currently borrowed by another user");
            }
        }

        const userRecord = await db.user.findUnique({
            where: {
                id: req.userId,
            },
            select: {
                role: true,
            },
        });

        if (!userRecord) {
            throw new ResponseError(404, "User not found");
        }

        if (userRecord.role === roles.ADMINISTRATOR) {
            throw new ResponseError(400, "Administrator can't borrow a book");
        }

        await this.verifyBookExists(req.bookId);

        const result: PrismaBorrowResult = await db.usersOnBooks.create({
            data: {
                userId: request.userId!,
                bookId: request.bookId,
                borrowDate: new Date(request.borrowDate),
                returnDate: new Date(request.returnDate),
                returnedDate: null,
            },
            select: {
                userId: true,
                bookId: true,
                borrowDate: true,
                returnDate: true,
                book: {
                    select: {
                        title: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                    }
                },
            },
        });

        await db.book.update({
            where: {
                isbn: req.bookId,
            },
            data: {
                isAvailable: false,
            },
        });

        return toBorrowResponse(result);
    }

    static async update(borrowingId: number): Promise<void> {
        const borrowingRecord = await db.usersOnBooks.count({
            where: {
                id: borrowingId,
            },
        });

        if (borrowingRecord === 0) {
            throw new ResponseError(404, "Corresponding borrow record is not found");
        }

        await db.usersOnBooks.update({
            where: {
                id: borrowingId,
            },
            data: {
                returnedDate: new Date(),
            },
        });
    }
}