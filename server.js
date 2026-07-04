import { createServer } from "node:http";
import { WebSocketServer } from "ws";

const port = process.env.PORT;

const httpServer = () => {
  createServer((req, res) => {});
};

const server = new WebSocketServer({ server: httpServer });

httpServer.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
