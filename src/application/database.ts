import {PrismaClient} from "../../generated/prisma";
import {logger} from "./logging";

export const db = new PrismaClient({
    log: [
        {
            emit:  "event",
            level: "query"
        },
        {
            emit:  "event",
            level: "error"
        },
        {
            emit:  "event",
            level: "info"
        },
        {
            emit:  "event",
            level: "warn"
        },
    ]
});

db.$on("error", (err: unknown) => {
    logger.error(err);
})
db.$on("warn", (err: unknown) => {
    logger.warn(err);
})
db.$on("query", (err: unknown) => {
    logger.info(err);
})
db.$on("info", (err: unknown) => {
    logger.info(err);
})