"use client";

import { useEffect, useRef } from "react";

export function MatrixChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high-res canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    
    // Configuration
    const colWidth = 20;
    const fontSize = 12;
    const numCols = Math.ceil(width / colWidth) + 2; // Extra cols for smooth scrolling
    
    // Initialize columns
    const columns = Array.from({ length: numCols }).map((_, i) => ({
      x: i * colWidth,
      targetHeight: Math.random() * height * 0.8 + 20,
      currentHeight: Math.random() * height * 0.8 + 20,
      speed: Math.random() * 0.5 + 0.2 // Speed of height change
    }));

    let animationFrame: number;
    let scrollOffset = 0;
    const scrollSpeed = 0.5; // Speed of horizontal scroll

    const render = () => {
      // Clear with slight trailing effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = "center";

      // Scroll horizontally
      scrollOffset -= scrollSpeed;
      if (scrollOffset <= -colWidth) {
        scrollOffset += colWidth;
        // Shift columns logic: pop first, push new to the end
        const firstCol = columns.shift()!;
        firstCol.x = columns[columns.length - 1].x + colWidth;
        firstCol.targetHeight = Math.random() * height * 0.8 + 20;
        columns.push(firstCol);
      }

      // Draw columns
      columns.forEach((col) => {
        // Update column height towards target
        if (Math.abs(col.currentHeight - col.targetHeight) < 1) {
          col.targetHeight = Math.random() * height * 0.8 + 20;
        } else {
          col.currentHeight += (col.targetHeight - col.currentHeight) * 0.05 * col.speed;
        }

        const drawX = col.x + scrollOffset;
        
        // Only draw visible columns
        if (drawX > -colWidth && drawX < width + colWidth) {
          const numChars = Math.floor(col.currentHeight / fontSize);
          
          for (let i = 0; i < numChars; i++) {
            const y = height - (i * fontSize);
            const char = Math.floor(Math.random() * 10).toString();
            
            // Color mapping: bottom is darker orange, top is lighter
            const alpha = 1 - (i / numChars) * 0.5;
            ctx.fillStyle = `rgba(235, 143, 52, ${alpha})`;
            
            ctx.fillText(char, drawX + colWidth / 2, y);
          }
        }
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] relative rounded-2xl overflow-hidden bg-white/40 shadow-inner">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block" 
        style={{ width: '100%', height: '100%' }}
      />
      <div className="absolute top-4 left-4 bg-white/80 px-3 py-1 rounded-md shadow-sm">
        <span className="font-bold text-sm text-gray-700">Real-time Data Flow</span>
      </div>
    </div>
  );
}
