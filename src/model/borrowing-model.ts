export type BorrowRequest = {
    borrowDate: Date;
    returnDate: Date;
    userId?: string;
    bookId: string;
}

export type BorrowResponse = {
    bookId: string;
    title: string;
    borrowDate: Date;
    returnDate: Date;
    name: string;
    userId: string;
}

export type StatsResponse = {
    booksTotal: number,
    borrowedTotal: number,
    averageBorrowedBooksPerMonth: number,
    notReturnedCount: number,
}

export interface PrismaBorrowResult {
    id: number;
    userId: string;
    bookId: string;
    borrowDate: Date;
    returnDate: Date;
    book: {
        title: string;
    };
    user: {
        name: string;
    };
}

export const toBorrowResponse = (data: PrismaBorrowResult) => ({
    bookId: data.bookId,
    title: data.book.title,
    borrowDate: data.borrowDate,
    returnDate: data.returnDate,
    name: data.user.name,
    userId: data.userId,
    id: data.id,
});