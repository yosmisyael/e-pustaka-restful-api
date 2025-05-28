import {
    CreateBookRequest,
    BookResponse,
    UpdateBookRequest,
    PaginatedBookResponse,
    SearchBooksOptions
} from "../model/book-model";
import {Validation} from "../validation/validation";
import {BookValidation} from "../validation/book-validation";
import {db} from "../application/database";
import {ResponseError} from "../error/response-error";
import {Prisma} from "../../generated/prisma";

export class BookService {
    static async verifyBookExist(bookId: string) {
        const result = await db.book.count({
            where: {
                isbn: bookId,
            },
        });

        if (result === 0) {
            throw new ResponseError(404, "Book not found");
        }
    }

    static async searchBooks(
        options: SearchBooksOptions = {}
    ): Promise<PaginatedBookResponse> {

        const pageNumber = Math.max(1, Number(options.page) || 1);
        const take = Math.max(1, Number(options.pageSize) || 12);
        const skip = (pageNumber - 1) * take;

        const whereClause: Prisma.BookWhereInput = {};

        if (options.bookId) {
            whereClause.isbn = options.bookId;
        }
        if (options.title) {
            whereClause.title = {
                contains: options.title,
            };
        }
        if (options.year) {
            whereClause.year = {
                equals: options.year,
            };
        }
        if (options.authorId) {
            whereClause.authorId = options.authorId;
        }
        if (options.authorName) {
            whereClause.author = {
                name: {
                    contains: options.authorName,
                },
            };
        }
        if (options.categoryId) {
            whereClause.categoryId = options.categoryId;
        }
        if (options.categoryName) {
            whereClause.category = {
                name: {
                    contains: options.categoryName,
                },
            };
        }

        const includeClause = {
            author: {
                select: { name: true },
            },
            category: {
                select: { name: true },
            },
        };

        const [books, totalItems] = await db.$transaction([
            db.book.findMany({
                where: whereClause,
                include: includeClause,
                skip: skip,
                take: take,
                orderBy: {
                    title: 'asc',
                },
            }),
            db.book.count({
                where: whereClause,
            }),
        ]);

        const totalPages = Math.ceil(totalItems / take);

        return {
            data: books,
            pagination: {
                totalItems: totalItems,
                itemCount: books.length,
                itemsPerPage: take,
                totalPages: totalPages,
                currentPage: pageNumber,
                hasNextPage: pageNumber < totalPages,
                hasPreviousPage: pageNumber > 1,
            },
        };
    }

    static async save(req: CreateBookRequest): Promise<BookResponse> {
        const request = Validation.validate(BookValidation.CREATE, req);

        await this.verifyBookExist(request.isbn);

        const result = await db.book.create({
            data: {
                isbn: req.isbn,
                title: req.title,
                description: req.description,
                year: req.year,
                pages: req.pages,
                language: req.language,
                cover: req.cover,
                author: {
                    connectOrCreate: {
                        where: { name: req.author },
                        create: { name: req.author },
                    }
                },
                category: {
                    connectOrCreate: {
                        where: { name: req.category },
                        create: { name: req.category },
                    }
                }
            },
            select: {
                isbn: true,
                title: true,
            },
        });

        return result as BookResponse;
    }

    static async update(bookId: string, req: UpdateBookRequest): Promise<BookResponse> {
        const request = Validation.validate(BookValidation.UPDATE, req);

        await this.verifyBookExist(bookId);

        const updateData: Prisma.BookUpdateInput = {};

        if (request.title !== undefined) {
            updateData.title = request.title;
        }
        if (request.description !== undefined) {
            updateData.description = request.description;
        }
        if (request.cover !== undefined) {
            updateData.cover = request.cover;
        }
        if (request.year !== undefined) {
            updateData.year = request.year;
        }
        if (request.pages !== undefined) {
            updateData.pages = request.pages;
        }
        if (request.language !== undefined) {
            updateData.language = request.language;
        }
        if (request.isAvailable !== undefined) {
            updateData.isAvailable = request.isAvailable;
        }

        if (request.author !== undefined) {
            let authorRecord = await db.author.findFirst({
                where: { name: request.author },
            });
            if (!authorRecord) {
                authorRecord = await db.author.create({
                    data: { name: request.author },
                });
            }
            updateData.author = { connect: { id: authorRecord.id } };
        }

        if (request.category !== undefined) {
            let categoryRecord = await db.category.findFirst({
                where: { name: request.category },
            });
            if (!categoryRecord) {
                categoryRecord = await db.category.create({
                    data: { name: request.category },
                });
            }
            updateData.category = { connect: { id: categoryRecord.id } };
        }

        const result = await db.book.update({
            where: {
                isbn: bookId,
            },
            data: updateData,
            select: {
                isbn: true,
                title: true,
                description: true,
                year: true,
                pages: true,
                language: true,
                isAvailable: true,
                cover: true,
            },
        });

        return result as BookResponse;
    }

    static async delete(bookId: string) {
        await this.verifyBookExist(bookId);

        await db.book.delete({
            where: {
                isbn: bookId,
            },
        });
    }
}