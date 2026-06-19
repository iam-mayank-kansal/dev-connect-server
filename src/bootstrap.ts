import connectToDB from "./config/database";
import logger from "./helper/logger";
import serverListenMessage from "./helper/serverListenMessage";
import { httpServer } from "./socket";

async function bootstrap() {
  try {
    await connectToDB();
    logger.log({
      level: "info",
      message: "Database connection established successfully",
      timestamp: new Date().toISOString(),
    });

    httpServer.listen(process.env.PORT, () => {
      serverListenMessage();
      logger.log({
        level: "info",
        message: `Server Running Fine at ${process.env.ORIGIN_URL}`,
        timestamp: new Date().toISOString(),
        serverInfo: {
          port: process.env.PORT,
          originUrl: process.env.ORIGIN_URL,
          clientUrl: process.env.CLIENT_URL,
          nodeVersion: process.version,
        },
      });
    });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `DB Connection Failed`,
      timestamp: new Date().toISOString(),
      error: {
        name: error?.name,
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
      },
    });

    // Exit process on DB connection failure
    process.exit(1);
  }
}

export default bootstrap;
