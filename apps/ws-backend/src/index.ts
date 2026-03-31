import "dotenv/config";
import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { parse } from "url";
import { prisma } from "@repo/db";
import { createServer } from "http";



// Change this line:
const server = createServer((req, res) => {
    // This handles standard HTTP requests (Health Checks)
    res.writeHead(200);
    res.end("WS Server is Healthy");
});

// The rest remains the same:
const wss = new WebSocketServer({ server });

const JWT_SECRET = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET_KEY not defined in environment variable");
}

const rooms = new Map<string, Set<WebSocket>>(); //this creaets a data structure to store rooms and users inside them

wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
  try {
   const { query } = parse(req.url!, true);
   const tokenFromQuery = query.token as string;
   const roomId = query.roomId as string;

   const rawCookie = req.headers.cookie;
   const parsed = rawCookie ? cookie.parse(rawCookie) : {};

   // Logic: Use Cookie first, if missing use Query
   const token = parsed.token || tokenFromQuery;

   console.log("Connection debug:", {
     hasCookie: !!rawCookie,
     hasQueryToken: !!tokenFromQuery,
   });

   if (!token) {
     console.log("Auth Failed: No token found in cookies or query");
     return ws.close(1008, "Token missing");
   }

    const decode = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decode.userId;
    console.log("JWT Verified for User:", userId);


    // {extract from room id}
    // parse the url and extract the query from it. then extract room id from the query

    if (!roomId) return ws.close();

    // this will check if the room has aleady this room id? if not then create it
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }

    const clients = rooms.get(roomId)!; 

    clients.add(ws); //add the user to the room

    // fetch previous state
    const previousMessages = await prisma.chat.findMany({
      where: { roomId: Number(roomId) },
      orderBy: { id: "asc" },
    });
    // Send all previous drawings to new user
    ws.send(
      JSON.stringify({
        kind: "init",
        messages: previousMessages,
      }),
    );

    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ kind: "joined", userId }));
      }
    });

    ws.on("message", async (data) => {
      let msg;

      try {
        msg = JSON.parse(data.toString());
        if (msg.kind === "draw") {
          try {
            await prisma.chat.create({
              data: {
                roomId: Number(roomId),
                userId,
                message: data.toString(),
              },
            });
          } catch (error) {
            console.error("Failed to save shape:", error);
          }

          clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(data.toString());
            }
          });
        }
      } catch (error) {
        return;
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      console.log("User disconnected:", userId);

      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ kind: "left", userId }));
        }
      });

      // clean up empty rooms
      if (clients.size === 0) {
        rooms.delete(roomId);
      }
    });
  } catch (error) {
    console.log("connection error:", error);
    ws.close();
  }
});

const PORT = Number(process.env.PORT) || 8080;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`WebSocket Server is running on port ${PORT}`);
});