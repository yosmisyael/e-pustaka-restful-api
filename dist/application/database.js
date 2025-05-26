"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
const logging_1 = require("./logging");
exports.db = new client_1.PrismaClient({
    log: [
        {
            emit: "event",
            level: "query"
        },
        {
            emit: "event",
            level: "error"
        },
        {
            emit: "event",
            level: "info"
        },
        {
            emit: "event",
            level: "warn"
        },
    ]
});
exports.db.$on("error", (err) => {
    logging_1.logger.error(err);
});
exports.db.$on("warn", (err) => {
    logging_1.logger.warn(err);
});
exports.db.$on("query", (err) => {
    logging_1.logger.info(err);
});
exports.db.$on("info", (err) => {
    logging_1.logger.info(err);
});
