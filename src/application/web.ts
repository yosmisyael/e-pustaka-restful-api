import express from "express";
import {publicRouter} from "../route/public-api";
import {errorMiddleware} from "../middleware/error-middleware";
import {authRouter} from "../route/auth-api";
import {adminRouter} from "../route/admin-api";
import cors from "cors";

export const web = express();

web.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
}));

web.use(express.json());

web.use(publicRouter);
web.use(authRouter);
web.use(adminRouter);

web.use(errorMiddleware);

