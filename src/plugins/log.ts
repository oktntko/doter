import log4js from "log4js";

log4js.configure({
  appenders: {
    application: {
      type: "file",
      filename: "logs/application.log",
      maxLogSize: 1024 * 1024 * 10,
      backups: 5,
      compress: true,
      keepFileExt: true,
      encoding: "utf-8",
      layout: {
        type: "pattern",
        pattern: "%d{yyyy-MM-dd hh:mm:ss.SSS} (%z) [%-5p] %m (%f{1}:%l)",
      },
    },
    access: {
      type: "file",
      filename: "logs/access.log",
      maxLogSize: 1024 * 1024 * 10,
      backups: 5,
      compress: true,
      keepFileExt: true,
      encoding: "utf-8",
      layout: {
        type: "pattern",
        pattern: "%d{yyyy-MM-dd hh:mm:ss.SSS} (%z) [%-5p] %m (%f{1}:%l)",
      },
    },
  },
  categories: {
    default: {
      appenders: ["application"],
      level: process.env.PROD ? "info" : "all",
      enableCallStack: true,
    },
    access: {
      appenders: ["access"],
      level: process.env.PROD ? "info" : "all",
      enableCallStack: true,
    },
  },
});

// * app log
const log = log4js.getLogger();

log.debug("Logger initialized.");

export default log;
export const access = log4js.getLogger("access");
