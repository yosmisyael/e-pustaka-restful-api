import {Request, Response, NextFunction} from 'express';
import {ZodError} from "zod";
import {ResponseError} from "../error/response-error";

export const errorMiddleware = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ZodError) {
        const formattedErrors = err.issues.map(issue => {
            const attributeName = issue.path.length > 0 ? issue.path.join('.') : '_global';
            return { [attributeName]: issue.message };
        });
        res.status(400).json({
            error: formattedErrors,
        });
    } else if (err instanceof ResponseError) {
        res.status(err.status).json({
            error: err.message,
        });
    } else {
        res.status(500).json({
            error: err.message,
        });
    }
}