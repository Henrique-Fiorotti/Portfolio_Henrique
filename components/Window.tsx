"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { useWindowLayout } from "./WindowLayout";

type Position = { x: number; y: number };

type DragState = {
  pointerId: number;
  clientX: number;
  clientY: number;
  origin: Position;
  windowRect: DOMRect;
  titleBarHeight: number;
};

type WindowProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

const DEFAULT_POSITION = { x: 0, y: 0 };
const MIN_VISIBLE_TITLEBAR = 72;
const SNAP_DISTANCE = 24;
const SNAP_GRID_SIZE = 24;
const TOUCH_HOLD_DELAY = 280;
const TOUCH_MOVE_TOLERANCE = 12;

let nextWindowLayer = 1;

const clamp = (value: number, min: number, max: number) => {
  if (min > max) return (min + max) / 2;
  return Math.min(Math.max(value, min), max);
};

export function Window({ title, children, className = "" }: WindowProps) {
  const { registerWindow, snapEnabled } = useWindowLayout();
  const [position, setPosition] = useState<Position>(DEFAULT_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [layer, setLayer] = useState(0);
  const windowRef = useRef<HTMLElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<Position>(DEFAULT_POSITION);
  const dragStart = useRef<DragState | null>(null);
  const pendingTouch = useRef<{ pointerId: number; clientX: number; clientY: number } | null>(null);
  const frame = useRef<number | null>(null);
  const touchTimer = useRef<number | null>(null);

  const bringToFront = () => {
    setLayer(nextWindowLayer++);
  };

  const queuePosition = (nextPosition: Position) => {
    positionRef.current = nextPosition;
    if (frame.current !== null) return;

    frame.current = window.requestAnimationFrame(() => {
      frame.current = null;
      setPosition(positionRef.current);
    });
  };

  const commitPosition = (nextPosition: Position) => {
    positionRef.current = nextPosition;
    if (frame.current !== null) {
      window.cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    setPosition(nextPosition);
  };

  const constrainPosition = (nextPosition: Position, origin: Position, windowRect: DOMRect, titleBarHeight: number) => ({
    x: clamp(
      nextPosition.x,
      origin.x + MIN_VISIBLE_TITLEBAR - windowRect.right,
      origin.x + window.innerWidth - MIN_VISIBLE_TITLEBAR - windowRect.left,
    ),
    y: clamp(
      nextPosition.y,
      origin.y + MIN_VISIBLE_TITLEBAR - (windowRect.top + titleBarHeight),
      origin.y + window.innerHeight - MIN_VISIBLE_TITLEBAR - windowRect.top,
    ),
  });

  const snapPosition = (nextPosition: Position, start: DragState) => {
    let snappedPosition = {
      x: Math.round(nextPosition.x / SNAP_GRID_SIZE) * SNAP_GRID_SIZE,
      y: Math.round(nextPosition.y / SNAP_GRID_SIZE) * SNAP_GRID_SIZE,
    };
    const left = start.windowRect.left + snappedPosition.x - start.origin.x;
    const top = start.windowRect.top + snappedPosition.y - start.origin.y;

    if (Math.abs(left) <= SNAP_DISTANCE) snappedPosition.x -= left;
    if (Math.abs(window.innerWidth - (left + start.windowRect.width)) <= SNAP_DISTANCE) {
      snappedPosition.x += window.innerWidth - (left + start.windowRect.width);
    }
    if (Math.abs(top) <= SNAP_DISTANCE) snappedPosition.y -= top;
    if (Math.abs(window.innerHeight - (top + start.titleBarHeight)) <= SNAP_DISTANCE) {
      snappedPosition.y += window.innerHeight - (top + start.titleBarHeight);
    }

    return constrainPosition(snappedPosition, start.origin, start.windowRect, start.titleBarHeight);
  };

  const clearTouchTimer = () => {
    if (touchTimer.current !== null) {
      window.clearTimeout(touchTimer.current);
      touchTimer.current = null;
    }
  };

  const startDragging = (pointerId: number, clientX: number, clientY: number) => {
    const windowElement = windowRef.current;
    const titleBar = titleBarRef.current;
    if (!windowElement || !titleBar || isMaximized) return;

    titleBar.setPointerCapture(pointerId);
    dragStart.current = {
      pointerId,
      clientX,
      clientY,
      origin: positionRef.current,
      windowRect: windowElement.getBoundingClientRect(),
      titleBarHeight: titleBar.getBoundingClientRect().height,
    };
    bringToFront();
    setIsDragging(true);
  };

  const resetWindow = () => {
    commitPosition(DEFAULT_POSITION);
    setIsDragging(false);
    setIsMinimized(false);
    setIsMaximized(false);
    setLayer(0);
  };

  useEffect(() => registerWindow(resetWindow), [registerWindow]);

  useEffect(() => {
    const keepTitleBarVisible = () => {
      if (isMaximized) return;

      const windowElement = windowRef.current;
      const titleBar = titleBarRef.current;
      if (!windowElement || !titleBar) return;

      const currentPosition = positionRef.current;
      const constrained = constrainPosition(
        currentPosition,
        currentPosition,
        windowElement.getBoundingClientRect(),
        titleBar.getBoundingClientRect().height,
      );
      if (constrained.x !== currentPosition.x || constrained.y !== currentPosition.y) {
        commitPosition(constrained);
      }
    };

    window.addEventListener("resize", keepTitleBarVisible);
    return () => {
      window.removeEventListener("resize", keepTitleBarVisible);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
      clearTouchTimer();
    };
  }, [isMaximized]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    if (event.pointerType === "touch") {
      pendingTouch.current = { pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY };
      clearTouchTimer();
      touchTimer.current = window.setTimeout(() => {
        const pending = pendingTouch.current;
        if (pending?.pointerId === event.pointerId) {
          pendingTouch.current = null;
          startDragging(pending.pointerId, pending.clientX, pending.clientY);
        }
      }, TOUCH_HOLD_DELAY);
      return;
    }

    startDragging(event.pointerId, event.clientX, event.clientY);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const pending = pendingTouch.current;
    if (!dragStart.current && pending?.pointerId === event.pointerId) {
      if (Math.hypot(event.clientX - pending.clientX, event.clientY - pending.clientY) > TOUCH_MOVE_TOLERANCE) {
        pendingTouch.current = null;
        clearTouchTimer();
      }
      return;
    }

    const start = dragStart.current;
    if (!start || start.pointerId !== event.pointerId) return;

    const nextPosition = constrainPosition(
      {
        x: start.origin.x + event.clientX - start.clientX,
        y: start.origin.y + event.clientY - start.clientY,
      },
      start.origin,
      start.windowRect,
      start.titleBarHeight,
    );
    queuePosition(nextPosition);
  };

  const finishDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (pendingTouch.current?.pointerId === event.pointerId) pendingTouch.current = null;
    clearTouchTimer();

    const start = dragStart.current;
    if (!start || start.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const finalPosition = snapEnabled
      ? snapPosition(positionRef.current, start)
      : constrainPosition(positionRef.current, start.origin, start.windowRect, start.titleBarHeight);

    commitPosition(finalPosition);
    dragStart.current = null;
    setIsDragging(false);
  };

  const moveWithKeyboard = (x: number, y: number) => {
    if (isMaximized) return;

    const windowElement = windowRef.current;
    const titleBar = titleBarRef.current;
    if (!windowElement || !titleBar) return;

    const currentPosition = positionRef.current;
    bringToFront();
    commitPosition(constrainPosition(
      { x: currentPosition.x + x, y: currentPosition.y + y },
      currentPosition,
      windowElement.getBoundingClientRect(),
      titleBar.getBoundingClientRect().height,
    ));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    const step = event.shiftKey ? 64 : 16;
    const directions: Record<string, [number, number]> = {
      ArrowUp: [0, -step],
      ArrowRight: [step, 0],
      ArrowDown: [0, step],
      ArrowLeft: [-step, 0],
    };

    if (event.key === "Home") {
      event.preventDefault();
      resetWindow();
      return;
    }

    const direction = directions[event.key];
    if (direction) {
      event.preventDefault();
      moveWithKeyboard(...direction);
    }
  };

  const stopWindowDrag = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const toggleMinimize = () => {
    bringToFront();
    setIsMaximized(false);
    setIsMinimized((minimized) => !minimized);
  };

  const toggleMaximize = () => {
    bringToFront();
    setIsMinimized(false);
    setIsMaximized((maximized) => !maximized);
  };

  return (
    <section
      ref={windowRef}
      className={`window ${className} ${isDragging ? "isDragging" : ""} ${isMinimized ? "isMinimized" : ""} ${isMaximized ? "isMaximized" : ""}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)`, zIndex: layer }}
    >
      <div
        ref={titleBarRef}
        className="windowBar"
        aria-label={`Mover janela ${title}. Use as setas para mover e Home para restaurar a posicao.`}
        role="group"
        onKeyDown={handleKeyDown}
        onPointerCancel={finishDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDragging}
        tabIndex={0}
      >
        <span className="windowTitle">{title}</span>
        <span className="windowControls">
          <button type="button" className="windowControl reset" aria-label="Restaurar janela" data-tooltip="Restaurar janela" onClick={resetWindow} onPointerDown={stopWindowDrag} />
          <button type="button" className="windowControl minimize" aria-label={isMinimized ? "Expandir janela" : "Minimizar janela"} data-tooltip={isMinimized ? "Expandir janela" : "Minimizar janela"} onClick={toggleMinimize} onPointerDown={stopWindowDrag} />
          <button type="button" className="windowControl maximize" aria-label={isMaximized ? "Restaurar tamanho" : "Maximizar janela"} data-tooltip={isMaximized ? "Restaurar tamanho" : "Maximizar janela"} onClick={toggleMaximize} onPointerDown={stopWindowDrag} />
        </span>
      </div>
      <div className="windowBody">{children}</div>
    </section>
  );
}
