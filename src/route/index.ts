import express, {Router} from "express";
import {publicRouter} from "./public-api";
import {authRouter} from "./auth-api";

export const router: Router = express.Router();

router.use("/api", publicRouter);
router.use("/api", authRouter);
router.use("/api/admin", publicRouter);
