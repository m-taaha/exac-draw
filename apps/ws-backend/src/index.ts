import { WebSocketServer, WebSocket } from "ws";
import {IncomingMessage} from "http";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

const wss = new WebSocketServer({port: 8080});

const JWT_SECRET = process.env.JWT_SECRET_KEY;
if(!JWT_SECRET) {
    throw new Error("JWT_SECRET_KEY not defined in environment variable")
}


wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    try {
            const rawCookie = req.headers.cookie;
            if (!rawCookie) return ws.close();

            const parsed = cookie.parse(rawCookie);
            const token = parsed.token;
            if (!token) return ws.close();

            const decode = jwt.verify(token, JWT_SECRET) as { userId: string };
            const userId = decode.userId;

            console.log("User connected:", userId);

            ws.on("message", (data) => {
                console.log("Message from", userId, ":", data.toString());

            });


            ws.on("close", () => {
                console.log("User disconnected:", userId)
            })
    } catch (error) {
        ws.close();
    }
})