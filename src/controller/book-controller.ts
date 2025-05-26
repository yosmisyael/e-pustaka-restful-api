import {Request, Response, NextFunction} from 'express';
import {
    BookResponse,
    CreateBookRequest,
    PaginatedBookResponse,
    SearchBooksOptions,
    UpdateBookRequest
} from "../model/book-model";
import {BookService} from "../service/book-service";
import {ResponseError} from "../error/response-error";

export class BookController {
    static async searchBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query;
            const options: SearchBooksOptions = {};

            if (query.bookId && typeof query.bookId === 'string') {
                options.bookId = query.bookId;
            }
            if (query.title && typeof query.title === 'string') {
                options.title = query.title;
            }
            if (query.authorName && typeof query.authorName === 'string') {
                options.authorName = query.authorName;
            }
            if (query.categoryName && typeof query.categoryName === 'string') {
                options.categoryName = query.categoryName;
            }

            if (query.authorId) {
                const authorIdNum = parseInt(query.authorId as string, 10);
                if (isNaN(authorIdNum)) {
                    return next(new ResponseError(400, "Invalid authorId: must be a number."));
                }
                options.authorId = authorIdNum;
            }
            if (query.categoryId) {
                const categoryIdNum = parseInt(query.categoryId as string, 10);
                if (isNaN(categoryIdNum)) {
                    return next(new ResponseError(400, "Invalid categoryId: must be a number."));
                }
                options.categoryId = categoryIdNum;
            }

            if (query.page) {
                const pageNum = parseInt(query.page as string, 10);
                if (isNaN(pageNum) || pageNum < 1) {
                    return next(new ResponseError(400, "Invalid page number: must be a positive number."));
                }
                options.page = pageNum;
            }
            if (query.pageSize) {
                const pageSizeNum = parseInt(query.pageSize as string, 10);
                if (isNaN(pageSizeNum) || pageSizeNum < 1) {
                    return next(new ResponseError(400, "Invalid pageSize: must be a positive number."));
                }
                options.pageSize = pageSizeNum;
            }

            const result: PaginatedBookResponse = await BookService.searchBooks(options);

            res.status(200).json(result);

        } catch (error) {
            next(error);
        }
    }

    static async addBook(req: Request, res: Response, next: NextFunction) {
        try {
            const request = req.body as CreateBookRequest;

            const response: BookResponse = await BookService.save(request);

            res.status(201).send({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }

    static async updateBook(req: Request, res: Response, next: NextFunction) {
        try {
            const isbn: string = req.params.bookId;

            const request = req.body as UpdateBookRequest;

            const response: BookResponse = await BookService.update(isbn, request);

            res.status(200).send({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }

    static async deleteBook(req: Request, res: Response, next: NextFunction) {
        try {
            const bookId: string = req.params.bookId;

            await BookService.delete(bookId);

            res.status(200).send({
                data: {
                    message: "OK",
                },
            });
        } catch (err) {
            next(err);
        }
    }
}