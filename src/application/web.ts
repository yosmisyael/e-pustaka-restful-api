import express from "express";
import {errorMiddleware} from "../middleware/error-middleware";
import {router} from "../route";
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

web.use(router);

web.use(errorMiddleware);

