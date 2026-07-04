import { createServer } from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";

import { WebSocketServer } from "ws";
import { redisPublish, redisSubscribe } from "./connection.js";

dotenv.config();

const port = process.env.PORT || 9000;
const REDIS_CHANNEL = "ws-message";

const httpServer = createServer(async (req, res) => {
  try {
    const indexFile = await fs.readFile(
      path.resolve("./public/index.html"),
      "utf-8",
    );
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(indexFile);
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Internal Server Error");
  }
});

const wsServer = new WebSocketServer({ server: httpServer });

redisSubscribe.subscribe(REDIS_CHANNEL);
redisSubscribe.on("message", (channelName, message) => {
  if (channelName === REDIS_CHANNEL) {
    wsServer.clients.forEach((client) => {
      client.send(message.toString());
    });
  }
});

wsServer.on("connection", async (websocket) => {
  console.log("WebSocket connection...");

  websocket.on("message", async (data) => {
    console.log(`Message received. ${data.toString()}`);

    //RELAY THE MESSAGE TO THE BROKER...
    await redisPublish.publish(REDIS_CHANNEL, data.toString());
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
