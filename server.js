import { createServer } from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

import { WebSocketServer } from "ws";

const port = process.env.PORT;

const httpServer = () => {
  createServer(async (req, res) => {
    const indexFile = fs.readFile(path.resolve("./public/index.html"), "utf-8");
    res.setHeader("Content-Type", "text/html");
    return res.end(indexFile);
  });
};

const wsServer = new WebSocketServer({ server: httpServer });

wsServer.on("connection", (websocket) => {
  console.log("WebSocket connection...");

  websocket.on("message", (data) => {
    console.log(`Message received. ${data.toString()}`);
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
