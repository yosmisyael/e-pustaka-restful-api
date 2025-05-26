import {UserRequest} from "../type/user-request";
import {Response, NextFunction} from "express";
import {roles} from "../../generated/prisma";
import {ResponseError} from "../error/response-error";

export const authorizeRoleMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
    const role = req.user!.role;
    if (role !== roles.ADMINISTRATOR) {
        return next(new ResponseError(403, "You are not permitted to perform this action"));
    } else {
        next();
    }
}