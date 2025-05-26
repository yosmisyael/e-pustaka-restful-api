import express from "express";
import {publicRouter} from "../route/public-api";
import {errorMiddleware} from "../middleware/error-middleware";
import {authRouter} from "../route/auth-api";
import {adminRouter} from "../route/admin-api";

export const web = express();

web.use(express.json());

web.use(publicRouter);
web.use(authRouter);
web.use(adminRouter);

web.use(errorMiddleware);

