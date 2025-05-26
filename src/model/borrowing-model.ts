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

export interface PrismaBorrowResult {
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
});