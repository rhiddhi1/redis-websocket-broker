import { createServer } from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";

import { WebSocketServer } from "ws";

dotenv.config();

const port = process.env.PORT || 9000;

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

wsServer.on("connection", (websocket) => {
  console.log("WebSocket connection...");

  websocket.on("message", (data) => {
    console.log(`Message received. ${data.toString()}`);

    wsServer.clients.forEach((client) => {
      client.send(data.toString());
    });
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
