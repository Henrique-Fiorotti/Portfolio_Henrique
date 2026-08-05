"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

type WindowProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

let nextWindowLayer = 1;

export function Window({ title, children, className = "" }: WindowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [layer, setLayer] = useState(0);
  const dragStart = useRef<{
    pointerId: number;
    clientX: number;
    clientY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const moveWindow = (x: number, y: number) => {
    setPosition((current) => ({ x: current.x + x, y: current.y + y }));
  };

  const bringToFront = () => {
    setLayer(nextWindowLayer++);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    bringToFront();
    dragStart.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      originX: position.x,
      originY: position.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    if (!start || start.pointerId !== event.pointerId) return;

    setPosition({
      x: start.originX + event.clientX - start.clientX,
      y: start.originY + event.clientY - start.clientY,
    });
  };

  const finishDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current?.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStart.current = null;
    setIsDragging(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 64 : 16;
    const directions: Record<string, [number, number]> = {
      ArrowUp: [0, -step],
      ArrowRight: [step, 0],
      ArrowDown: [0, step],
      ArrowLeft: [-step, 0],
    };

    if (event.key === "Home") {
      event.preventDefault();
      bringToFront();
      setPosition({ x: 0, y: 0 });
      return;
    }

    const direction = directions[event.key];
    if (direction) {
      event.preventDefault();
      bringToFront();
      moveWindow(...direction);
    }
  };

  return (
    <section
      className={`window ${className} ${isDragging ? "isDragging" : ""}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)`, zIndex: layer }}
    >
      <div
        className="windowBar"
        aria-label={`Mover janela ${title}. Use as setas para mover e Home para restaurar a posi\u00e7\u00e3o.`}
        onKeyDown={handleKeyDown}
        onPointerCancel={finishDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDragging}
        tabIndex={0}
      >
        <span className="windowTitle">{title}</span>
        <span className="windowControls" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      {children}
    </section>
  );
}
