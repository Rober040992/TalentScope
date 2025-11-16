import winston from "winston";

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf((info) => {
    const level = String(info.level || "info").toUpperCase();
    const message = typeof info.message === "string"
      ? info.message
      : JSON.stringify(info.message);

    return `[${info.timestamp}] ${level}: ${message}`;
  })
);

export const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" })
  ]
});
