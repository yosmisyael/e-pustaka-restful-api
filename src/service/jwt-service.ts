import jwt, {JwtPayload, Secret} from "jsonwebtoken";
import {RefreshTokenRequest, TokenPayload, UserPayload} from "../model/user-model";
import dotenv from "dotenv";
import {ResponseError} from "../error/response-error";
import {UserValidation} from "../validation/user-validation";
import {Validation} from "../validation/validation";
import {db} from "../application/database";

dotenv.config();

const secretAccess = process.env.ACCESS_TOKEN_KEY as Secret;
const secretRefresh = process.env.REFRESH_TOKEN_KEY as Secret;

export default class JwtService {
    static generateToken(user: UserPayload): TokenPayload {
        return {
            accessToken: jwt.sign(user, secretAccess, {
                expiresIn: "15s",
            }),
            refreshToken: jwt.sign(user, secretRefresh, {
                expiresIn: "7d",
            }),
        };
    }

    static authenticateToken(token: string): JwtPayload & UserPayload {
        try {
            return jwt.verify(token, secretAccess) as JwtPayload & UserPayload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ResponseError(401, "Access token expired");
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ResponseError(401, "Invalid access token");
            }
            throw new ResponseError(500, "Internal server error during token verification");
        }
    }

    static async refreshUserToken(req: RefreshTokenRequest): Promise<TokenPayload> {
        const { refreshToken } = Validation.validate(UserValidation.REFRESH, req);

        if (!refreshToken) {
            throw new ResponseError(400, "Invalid refresh token");
        }

        const decoded = this.verifyRefreshToken(refreshToken);

        if (!decoded || !decoded.sub) {
            throw new ResponseError(401, "Invalid refresh token");
        }

        const userId = decoded.sub;

        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new ResponseError(401, "User not found for this refresh token");
        }

        if (user.token !== refreshToken) {
            throw new ResponseError(401, "Invalid refresh token");
        }

        const userPayload: UserPayload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        }

        const token: TokenPayload = this.generateToken(userPayload);

        await db.user.update({
            where: {
                id: userId,
            },
            data: {
                token: token.refreshToken,
            }
        });

        return token;
    }

    static verifyRefreshToken(token: string): UserPayload & JwtPayload {
        try {
            return jwt.verify(token, secretRefresh) as UserPayload & JwtPayload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ResponseError(401, "Refresh token expired");
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ResponseError(401, "Invalid refresh token");
            }
            throw new ResponseError(500, "Internal server error during refresh token verification");
        }
    }
}