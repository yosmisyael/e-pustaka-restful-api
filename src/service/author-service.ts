import {AuthorResponse, AuthorRequest} from "../model/author-model";
import {Validation} from "../validation/validation";
import {AuthorValidation} from "../validation/author-validation";
import {db} from "../application/database";
import {ResponseError} from "../error/response-error";
import {Prisma} from "../../generated/prisma";

export class AuthorService {
    static async verifyAuthorExist(identifier: string | number, exclude?: number): Promise<boolean> {
        let whereClause: Prisma.AuthorWhereInput = {};

        if (typeof identifier === "string") {
            whereClause.name = identifier;
        } else {
            whereClause.id = identifier;
        }

        if (exclude) {
            whereClause.NOT = {
                id: exclude,
            };
        }

        const countRecord = await db.author.count({
            where: whereClause,
        });

        return countRecord > 0;
    }

    static async getAuthorById(authorId: number): Promise<AuthorResponse> {
        const isAuthorExists = await this.verifyAuthorExist(authorId);

        if (!isAuthorExists) {
            throw new ResponseError(404, "Author not found");
        }

        const result = await db.author.findUnique({
            where: {
                id: authorId,
            },
        });

        return result!;
    }

    static async getAllAuthors(): Promise<AuthorResponse[]> {
        return db.author.findMany({});
    }

    static async save(req: AuthorRequest): Promise<AuthorResponse> {
        const request: AuthorRequest = Validation.validate(AuthorValidation.REGISTER, req);

        const isExists: boolean = await this.verifyAuthorExist(request.name);

        if (isExists) {
            throw new ResponseError(400, "Author already exists");
        }

        return db.author.create({
            data: req,
        });
    }

    static async update(authorId: number, req: AuthorRequest): Promise<AuthorResponse> {
        const request: AuthorRequest = Validation.validate(AuthorValidation.UPDATE, req);

        const isExists: boolean = await this.verifyAuthorExist(authorId);

        if (!isExists) {
            throw new ResponseError(404, "Author not found");
        }

        const isUnique: boolean = await this.verifyAuthorExist(request.name, authorId);

        if (isUnique) {
            throw new ResponseError(400, "Author already exists");
        }

        return db.author.update({
            where: {
                id: authorId,
            },
            data: {
                name: request.name,
            },
        });
    }

    static async delete(authorId: number): Promise<void> {
        const isExists: boolean = await this.verifyAuthorExist(authorId);

        if (!isExists) {
            throw new ResponseError(404, "Author not found");
        }

        await db.author.delete({
            where: {
                id: authorId,
            },
        });
    }
}