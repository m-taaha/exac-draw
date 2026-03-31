"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, use } from "react";

interface Shapes {
  x: number;
  y: number;
  w: number;
  h: number;
  shapeType: "rect" | "circle" | "line" | "pencil"; // ← added pencil
  points?: { x: number; y: number }[];
}

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const router = useRouter();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);
  const shapes = useRef<Shapes[]>([]);
  const [tool, setTool] = useState<"rect" | "circle" | "line" | "pencil">(
    "rect",
  );
  const currentPoints = useRef<{ x: number; y: number }[]>([]); 
  const startX = useRef(0);
  const startY = useRef(0);
  const wsRef = useRef<WebSocket | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">("connecting"); //tracks the ws connection
  const [isLoadingShapes, setIsLoadingShapes] = useState(true);

  // Auth check eefect
  useEffect(() => {
  const checkAuth = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_HTTP_URL}/api/v1/user/me`, {
        withCredentials: true,
      });
    } catch (error) {
      // If the backend says "Unauthorized", go to signin
      router.push("/signin");
    }
  };

  checkAuth();
}, [router]);


 useEffect(() => {
   const protocol = window.location.protocol === "https:" ? "wss" : "ws";

   // Clean up the URL: remove protocol from env and ensure fallback is just the domain
   const wsBase =
     process.env.NEXT_PUBLIC_WS_URL?.replace(/^https?:\/\//, "") ||
     "ws-backend-cc7e.onrender.com";

     const token = localStorage.getItem("token");

const ws = new WebSocket(`${protocol}://${wsBase}?roomId=${roomId}&token=${token}`);

   ws.onopen = () => {
     console.log("WS connected");
     setWsStatus("connected");
   };
   ws.onclose = () => {
     console.log("WS disconnected");
     setWsStatus("disconnected");
   };
   ws.onmessage = (event) => {
     const msg = JSON.parse(event.data);
     if (msg.kind === "draw") {
       shapes.current.push(msg.shape);
       redrawCanvas();
     } else if (msg.kind === "init") {
       const initShapes = msg.messages.map(
         (m: any) => JSON.parse(m.message).shape,
       );
       shapes.current = initShapes;
       redrawCanvas();
     } else if (msg.kind === "joined") {
       setActiveUsers((prev) => [...prev, msg.userId]);
     } else if (msg.kind === "left") {
       setActiveUsers((prev) => prev.filter((id) => id !== msg.userId));
     }
   };
   wsRef.current = ws;
   return () => ws.close();
   // Fixed the typo here: changed };, to }
 }, [roomId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctxRef.current = canvas.getContext("2d");
  }, []);

  useEffect(() => {
    const fetchShapes = async () => {
      setIsLoadingShapes(true);

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_HTTP_URL}/api/v1/room/${roomId}/shapes`,
          { withCredentials: true },
        );
        shapes.current = res.data.shapes;
        if (ctxRef.current) redrawCanvas();
      } catch (error) {
        console.log("Failed to load shapes", error);
      } finally {
        setIsLoadingShapes(false)
      }
    };
    fetchShapes();
  }, [roomId]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDrawing.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;

    // ← NEW: start collecting pencil points on mousedown
    if (tool === "pencil") {
      currentPoints.current = [{ x: e.clientX, y: e.clientY }];
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    isDrawing.current = false;

    let shape: Shapes;

    // ← NEW: pencil shape uses points array instead of x/y/w/h
    if (tool === "pencil") {
      shape = {
        x: 0,
        y: 0,
        w: 0,
        h: 0, // unused for pencil
        shapeType: "pencil",
        points: currentPoints.current,
      };
    } else {
      shape = {
        x: startX.current,
        y: startY.current,
        w: e.clientX - startX.current,
        h: e.clientY - startY.current,
        shapeType: tool,
      };
    }

    shapes.current.push(shape);
    wsRef.current?.send(JSON.stringify({ kind: "draw", shape }));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing.current) return;
    const ctx = ctxRef.current;
    if (!ctx) return;

    const width = e.clientX - startX.current;
    const height = e.clientY - startY.current;

    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    redrawCanvas();

    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;

    if (tool === "pencil") {
      currentPoints.current.push({ x: e.clientX, y: e.clientY });
      const points = currentPoints.current;
      ctx.beginPath();
      ctx.moveTo(points[0]!.x, points[0]!.y);
      points.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    } else if (tool === "rect") {
      ctx.strokeRect(startX.current, startY.current, width, height);
    } else if (tool === "circle") {
      const rx = width / 2;
      const ry = height / 2;
      ctx.beginPath();
      ctx.ellipse(
        startX.current + rx,
        startY.current + ry,
        Math.abs(rx),
        Math.abs(ry),
        0,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    } else if (tool === "line") {
      ctx.beginPath();
      ctx.moveTo(startX.current, startY.current);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    }
  };

  const redrawCanvas = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;

    shapes.current.forEach((shape) => {
      if (shape.shapeType === "rect") {
        ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
      } else if (shape.shapeType === "circle") {
        const rx = shape.w / 2;
        const ry = shape.h / 2;
        ctx.beginPath();
        ctx.ellipse(
          shape.x + rx,
          shape.y + ry,
          Math.abs(rx),
          Math.abs(ry),
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      } else if (shape.shapeType === "line") {
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.x + shape.w, shape.y + shape.h);
        ctx.stroke();
      } else if (shape.shapeType === "pencil") {
        // ← NEW: redraw pencil paths from saved points
        if (!shape.points || shape.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(shape.points[0]!.x, shape.points[0]!.y);
        shape.points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      }
    });
  };

  return (
    <div className="w-screen h-screen bg-[#1a1a2e] overflow-hidden">
      {/* ws status */}
      <div
        className={`absolute top-4 left-4 z-10 text-xs px-2 py-1 rounded-full ${
          wsStatus === "connected"
            ? "bg-green-500/20 text-green-400"
            : wsStatus === "connecting"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
        }`}
      >
        {wsStatus === "connected"
          ? "● Live"
          : wsStatus === "connecting"
            ? "● Connecting..."
            : "● Disconnected"}
      </div>

      {/* active users */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {activeUsers.map((id) => (
          <div
            key={id}
            className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-medium"
          >
            {id.slice(0, 2).toUpperCase()}
          </div>
        ))}
      </div>

      {/* toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-[#111111] border border-zinc-800 rounded-xl px-4 py-2 flex gap-3">
        <button
          onClick={() => setTool("rect")}
          className={
            tool === "rect"
              ? "text-white bg-zinc-800 transition-colors text-sm px-3 py-1.5 rounded-lg"
              : "text-zinc-400 hover:text-white transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-zinc-800"
          }
        >
          Rectangle
        </button>
        <button
          onClick={() => setTool("circle")}
          className={
            tool === "circle"
              ? "text-white bg-zinc-800 transition-colors text-sm px-3 py-1.5 rounded-lg"
              : "text-zinc-400 hover:text-white transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-zinc-800"
          }
        >
          Circle
        </button>
        <button
          onClick={() => setTool("line")}
          className={
            tool === "line"
              ? "text-white bg-zinc-800 transition-colors text-sm px-3 py-1.5 rounded-lg"
              : "text-zinc-400 hover:text-white transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-zinc-800"
          }
        >
          Line
        </button>

        {/* ← NEW: pencil button */}
        <button
          onClick={() => setTool("pencil")}
          className={
            tool === "pencil"
              ? "text-white bg-zinc-800 transition-colors text-sm px-3 py-1.5 rounded-lg"
              : "text-zinc-400 hover:text-white transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-zinc-800"
          }
        >
          Pencil
        </button>

        <button
          onClick={async () => {
            await axios.post(
              `${process.env.NEXT_PUBLIC_HTTP_URL}/api/v1/user/signout`,
              {},
              { withCredentials: true },
            );
            window.location.href = "/signin";
          }}
          className="text-zinc-400 hover:text-red-400 transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-zinc-800"
        >
          Sign out
        </button>
      </div>

      {isLoadingShapes && (
        <div className="absolute inset-0 bg-[#1a1a2e] flex items-center justify-center z-20">
          <p className="text-zinc-400 text-sm">Loading canvas...</p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        id="canvas"
        className="w-full h-full"
      />
    </div>
  );
}
