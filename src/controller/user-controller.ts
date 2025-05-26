import {Request, Response, NextFunction} from 'express';
import {UserService} from "../service/user-service";
import {LoginUserRequest, RefreshTokenRequest, RegisterUserRequest, ResetPasswordRequest} from "../model/user-model";
import {UserRequest} from "../type/user-request";
import JwtService from "../service/jwt-service";

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RegisterUserRequest = req.body as RegisterUserRequest;

            const response = await UserService.register(request);

            res.status(201).json({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest;
            const response = await UserService.login(request);
            res.status(200).json({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }

    static async reset(req: UserRequest, res: Response, next: NextFunction) {
        try {
            await UserService.reset(req.user!, req.body as ResetPasswordRequest);

            res.status(200).json({
                data: {
                    message: "Your password has been successfully reset, please log in again using your new credentials",
                },
            });
        } catch (err) {
            next(err);
        }
    }

    static async logout(req: UserRequest, res: Response, next: NextFunction) {
        try {
            await UserService.logout(req.user!);
            res.status(200).json({
                data: {
                    message: "OK",
                },
            });
        } catch (err) {
            next(err);
        }
    }

    static async refreshToken(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request = req.body as RefreshTokenRequest;

            const token = await JwtService.refreshUserToken(request);

            res.status(200).json({
                data: token,
            });
        } catch (err) {
            next(err);
        }
    }
}