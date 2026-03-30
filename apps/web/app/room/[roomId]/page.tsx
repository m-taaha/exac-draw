"use client";

import axios from "axios";
import { useEffect, useRef, useState, use } from "react";

interface Shapes {
  x: number;
  y: number;
  w: number;
  h: number;
  shapeType: "rect" | "circle" | "line";
}

export default function RoomPage({params,}: {  params: Promise<{ roomId: string }>;}) {
  const { roomId } = use(params);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // from here - or this state will track the drawing
  const isDrawing = useRef(false);
  const shapes = useRef<Shapes[]>([]); //store all shapes
  const [tool, setTool] = useState<"rect" | "circle" | "line">("rect");
  
  // point where the user starts
  const startX = useRef(0);
  const startY = useRef(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);



  
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080?roomId=${roomId}`);

    ws.onopen = () => console.log("WS connected");
    ws.onclose = () => console.log("WS disconnected");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.kind === "draw") {
        shapes.current.push(msg.shape);
        redrawCanvas();
      } else if (msg.kind === "joined") {
        setActiveUsers((prev) => [...prev, msg.userId]);
      } else if (msg.kind === "left") {
        setActiveUsers((prev) => prev.filter((id) => id !== msg.userId));
      }
    };

    wsRef.current = ws;

    return () => ws.close();
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
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/room/${roomId}/shapes`,
          { withCredentials: true },
        );

        shapes.current = res.data.shapes;

        if (ctxRef.current) {
          redrawCanvas();
        }
      } catch (error) {
        console.log("Failed to load shapes", error);
      }
    };

    fetchShapes();
  }, [roomId]);

  //{ mouse handler down -- clicked }
  const handleMouseDown = (e: React.MouseEvent) => {
    isDrawing.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  //{ mouse up handler - releasing the clicked  button }
  const handleMouseUp = (e: React.MouseEvent) => {
    isDrawing.current = false;

    //save the completed the shapes othewise it will vanish the momemt you to try to draw something else
    const shape = {
      x: startX.current,
      y: startY.current,
      w: e.clientX - startX.current,
      h: e.clientY - startY.current,
      shapeType: tool,
    };

    //save locally
    shapes.current.push(shape);

    //send via websocket
    wsRef.current?.send(
      JSON.stringify({
        kind: "draw",
        shape,
      }),
    );
  };

  // {mouse move handler or drag - }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing.current) return; //only draw when the button is clicked

    const ctx = ctxRef.current;
    if (!ctx) return;

    //calculate teh width and height from start point to current point using x2-x1 to calculate distance
    const width = e.clientX - startX.current;
    const height = e.clientY - startY.current;

    //    clear canvas on every move - otherwise you get ghose rectangles
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

    //    re-draw all saved shapes first
    redrawCanvas();

    // draw the shape currently being dragged
    if (tool === "rect") {
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

  // reussable redraw function
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
      }
    });
  };

  return (
    <div className="w-screen h-screen bg-[#1a1a2e] overflow-hidden">
      {/* active users top right */}
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
              ? "text-white bg-zinc-800  transition-colors text-sm px-3 py-1.5 rounded-lg "
              : "text-zinc-400 hover:text-white transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-zinc-800"
          }
        >
          Rectangle
        </button>

        <button
          onClick={() => setTool("circle")}
          className={
            tool === "circle"
              ? "text-white bg-zinc-800  transition-colors text-sm px-3 py-1.5 rounded-lg "
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

        <button
          onClick={async () => {
            await axios.post(
              "http://localhost:8000/api/v1/user/signout",
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

      {/* canvas to draw */}
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