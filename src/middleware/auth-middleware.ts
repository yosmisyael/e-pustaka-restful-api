import {Response, NextFunction} from "express";
import JwtService from "../service/jwt-service";
import {ResponseError} from "../error/response-error";
import {UserRequest} from "../type/user-request";
import {JwtPayload} from "jsonwebtoken";
import {UserPayload} from "../model/user-model";
import {logger} from "../application/logging";

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new ResponseError(401, "Unauthorized"));
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return next(new ResponseError(401, "Unauthorized"));
    }

    const token = parts[1];

    try {
        const {sub, email, name, role}: UserPayload & JwtPayload = JwtService.authenticateToken(token);

        req.user = {
            id: sub,
            email,
            name,
            role,
        };

        next();
    } catch (error: unknown) {
        logger.error("Auth Middleware:", error);
        next(error);
    }
};