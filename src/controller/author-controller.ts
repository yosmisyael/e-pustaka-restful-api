import {AuthorResponse, AuthorRequest} from "../model/author-model";
import {AuthorService} from "../service/author-service";
import {Request, Response, NextFunction} from 'express';

export class AuthorController {
    static async addAuthor(req: Request, res: Response, next: NextFunction) {
        try {
            const request: AuthorRequest = req.body as AuthorRequest;

            const response: AuthorResponse = await AuthorService.save(request);

            res.status(201).send({
                data: response,
            })
        } catch (err) {
            next(err);
        }
    }

    static async updateAuthor(req: Request, res: Response, next: NextFunction) {
        try {
            const authorId: number = Number(req.params.authorId);

            const request: AuthorRequest = req.body as AuthorRequest;

            const response: AuthorResponse = await AuthorService.update(authorId, request);

            res.status(200).send({
                data: response,
            })
        } catch (err) {
            next(err);
        }
    }

    static async getAuthorById(req: Request, res: Response, next: NextFunction) {
        try {
            const authorId: number = Number(req.params.authorId);

            const response = await AuthorService.getAuthorById(authorId);

            res.status(200).send({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getAllAuthors(req: Request, res: Response, next: NextFunction) {
        try {
            const response: AuthorResponse[] = await AuthorService.getAllAuthors();

            res.status(200).send({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }

    static async deleteAuthor(req: Request, res: Response, next: NextFunction) {
        try {
            const authorId: number = Number(req.params.authorId);

            await AuthorService.delete(authorId);

            res.status(200).send({
                data: {
                    message: "OK",
                },
            })
        } catch (err) {
            next(err);
        }
    }
}