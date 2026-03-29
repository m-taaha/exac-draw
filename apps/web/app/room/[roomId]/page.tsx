"use client"

import { useEffect, useRef, useState } from "react";

interface Shapes {
    x: number,
    y: number,
    w: number,
    h: number,
    type: "rect" | "circle" | "line"
} 


export default function RoomPage({params}: {params: {roomId: string}}) {
    const roomId = params.roomId;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

    // from here - or this state will track the drawing 
    const isDrawing = useRef(false);
    const shapes = useRef<Shapes[]>([]) //store all shapes
    const [tool, setTool] = useState<"rect" | "circle" | "line">("rect") 

    // point where the user starts 
    const startX = useRef(0);
    const startY = useRef(0);



    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctxRef.current = canvas.getContext("2d");
    }, [])


    // mouse handler down -- clicked 
    const handleMouseDown = (e: React.MouseEvent) => {
        isDrawing.current = true;
        startX.current = e.clientX;
        startY.current = e.clientY;
    }





    // mouse up handler - releasing the clicked  button 
    const handleMouseUp = (e: React.MouseEvent) => {
        isDrawing.current = false

        //save the completed the shapes othewise it will vanish the momemt you to try to draw something else
             shapes.current.push({
               x: startX.current,
               y: startY.current,
               w: e.clientX - startX.current,
               h: e.clientY - startY.current,
               type: tool, 
             });
    }


    // mouse move handler or drag - 
    const handleMouseMove = (e: React.MouseEvent) => {
       if (!isDrawing.current) return; //only draw when the button is clicked

       const ctx = ctxRef.current
       if(!ctx) return;

       //calculate teh width and height from start point to current point using x2-x1 to calculate distance
       const width = e.clientX - startX.current;
       const height = e.clientY - startY.current;

    //    clear canvas on every move - otherwise you get ghose rectangles
       ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)


    //    re-draw all saved shapes first 
    ctx.strokeStyle = "#6366f1"
    ctx.lineWidth = 2;
    shapes.current.forEach((shape) => {
      if (shape.type === "rect") {
        ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
      } else if (shape.type === "circle") {
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
      } else if (shape.type === "line") {
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.x + shape.w, shape.y + shape.h);
        ctx.stroke();
      }
    });

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

    }




    return (
      <div className="w-screen h-screen bg-[#1a1a2e] overflow-hidden">
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