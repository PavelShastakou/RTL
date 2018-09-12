import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        winston.format.timestamp(),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

export { logger };
