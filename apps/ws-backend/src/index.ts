import "dotenv/config";
import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { parse } from "url";
import { prisma } from "@repo/db";



const wss = new WebSocketServer({ port: 8080 });

const JWT_SECRET = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET_KEY not defined in environment variable");
}


    const rooms = new Map<string, Set<WebSocket>>(); //this creaets a data structure to store rooms and users inside them 

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  try {
    const rawCookie = req.headers.cookie;
    if (!rawCookie) return ws.close();

    const parsed = cookie.parse(rawCookie);
    const token = parsed.token;
    if (!token) return ws.close();

    const decode = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decode.userId;


    // parse the url and extract the query from it. then extract room id from the query
    const {query} = parse(req.url!, true);
    const roomId = query.roomId as string;
    if(!roomId) return ws.close();
    

    // this will check if the room has aleady this room id? if not then create it 
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }

    rooms.get(roomId)!.add(ws); //add the user to the room



    console.log("User connected:", userId);

    ws.on("message", async (data) => {
          try {
            console.log("Saving shape to DB:", data.toString()); 
            await prisma.chat.create({
              data: {
                roomId: Number(roomId),
                userId,
                message: data.toString(),
              },
            });
            console.log("Shape saved successfully"); 
            
          } catch (error) {
            console.error("Failed to save shape:", error); 
          }

      rooms.get(roomId)?.forEach(client => {
        // send the message to everyone in room but not the user itself because he created the message or generated
        if(client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data.toString());
        }
      });
    });

    ws.on("close", () => {
      rooms.get(roomId)?.delete(ws);
      console.log("User disconnected:", userId);
    });
  } catch (error) {
    ws.close();
  }
});
