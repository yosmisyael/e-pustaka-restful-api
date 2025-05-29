import {
    BorrowRequest,
    BorrowResponse,
    PrismaBorrowResult,
    StatsResponse,
    toBorrowResponse
} from "../model/borrowing-model";
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

    static async getBorrowingById(borrowingId: number) {
        const countRecord = await db.usersOnBooks.count({
            where: {
                id: borrowingId,
            },
        });

        if (countRecord === 0) {
            throw new ResponseError(404, "Borrowing record not found");
        }

        const result = await db.usersOnBooks.findUnique({
            where: {
                id: borrowingId,
            },
        });

        return result!;
    }

    static async getAllBorrowingList() {
        return db.usersOnBooks.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        email: true,
                    },
                },
                book: {
                    select: {
                        isbn: true,
                        title: true,
                        year: true,
                        description: true,
                        language: true,
                        pages: true,
                        cover: true,
                        author: {
                            select: { name: true },
                        },
                        category: {
                            select: { name: true },
                        },
                    }
                },
            },
        });
    }

    static async getCurrentLoan(bookId: string) {
        return db.usersOnBooks.findFirst({
            where: {
                bookId,
                returnedDate: null,
            }
        });
    }

    static async getLoansByUserId(userId: string) {
        return db.usersOnBooks.findMany({
            where: {
                userId,
            },
            select: {
                id: true,
                borrowDate: true,
                returnDate: true,
                returnedDate: true,
                book: {
                    include: {
                        author: {
                            select: { name: true },
                        },
                        category: {
                            select: { name: true },
                        },
                    },
                },
            },
            orderBy: {
                borrowDate: 'desc',
            },
        });
    }

    static async getLoansData(): Promise<StatsResponse> {
        const [
            booksTotal,
            borrowedTotal,
            allBorrowingsRecord,
            overdueAndNotReturnedCount
        ] = await db.$transaction([
            db.book.count({}),
            db.usersOnBooks.count({}),
            db.usersOnBooks.findMany({
                select: {
                    borrowDate: true,
                },
            }),
            db.usersOnBooks.count({
                where: {
                    returnedDate: null,
                    returnDate: {
                        lt: new Date(),
                    },
                },
            }),
        ]);

        const monthlyCounts: { [yearMonth: string]: number } = {};

        allBorrowingsRecord.forEach(record => {
             const year = record.borrowDate.getFullYear();
             const month = record.borrowDate.getMonth() + 1;
             const yearMonthKey = `${year}-${String(month).padStart(2, '0')}`;
             monthlyCounts[yearMonthKey] = (monthlyCounts[yearMonthKey] || 0) + 1;
        });

        const distinctMonthsWithLoans = Object.keys(monthlyCounts).length;

        const totalLoans = allBorrowingsRecord.length;
        const average = distinctMonthsWithLoans !== 0 ? totalLoans / distinctMonthsWithLoans : 0;

        return {
            booksTotal,
            borrowedTotal,
            averageBorrowedBooksPerMonth: average,
            notReturnedCount: overdueAndNotReturnedCount,
        }

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