"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useWindowLayout } from "./WindowLayout";
const DEFAULT_POSITION = {
  x: 0,
  y: 0
};
const MIN_VISIBLE_TITLEBAR = 72;
const TOUCH_HOLD_DELAY = 280;
const TOUCH_MOVE_TOLERANCE = 12;
let nextWindowLayer = 1;
let scrollLockCount = 0;
let previousBodyOverflow = "";
let previousHtmlOverflow = "";
const clamp = (value, min, max) => {
  if (min > max) return (min + max) / 2;
  return Math.min(Math.max(value, min), max);
};
export function Window({
  title,
  children,
  className = "",
  interactive = true
}) {
  const {
    registerWindow
  } = useWindowLayout();
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [layer, setLayer] = useState(0);
  const windowRef = useRef(null);
  const titleBarRef = useRef(null);
  const positionRef = useRef(DEFAULT_POSITION);
  const dragStart = useRef(null);
  const pendingTouch = useRef(null);
  const frame = useRef(null);
  const touchTimer = useRef(null);
  const animationStartRect = useRef(null);
  const resizeTween = useRef(null);
  const bringToFront = () => {
    setLayer(nextWindowLayer++);
  };
  const queuePosition = nextPosition => {
    positionRef.current = nextPosition;
    if (frame.current !== null) return;
    frame.current = window.requestAnimationFrame(() => {
      frame.current = null;
      setPosition(positionRef.current);
    });
  };
  const commitPosition = nextPosition => {
    positionRef.current = nextPosition;
    if (frame.current !== null) {
      window.cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    setPosition(nextPosition);
  };
  const constrainPosition = (nextPosition, origin, windowRect, titleBarHeight) => ({
    x: clamp(nextPosition.x, origin.x + MIN_VISIBLE_TITLEBAR - windowRect.right, origin.x + window.innerWidth - MIN_VISIBLE_TITLEBAR - windowRect.left),
    y: clamp(nextPosition.y, origin.y + MIN_VISIBLE_TITLEBAR - (windowRect.top + titleBarHeight), origin.y + window.innerHeight - MIN_VISIBLE_TITLEBAR - windowRect.top)
  });
  const clearTouchTimer = () => {
    if (touchTimer.current !== null) {
      window.clearTimeout(touchTimer.current);
      touchTimer.current = null;
    }
  };
  const startDragging = (pointerId, clientX, clientY) => {
    if (!interactive) return;
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
      titleBarHeight: titleBar.getBoundingClientRect().height
    };
    bringToFront();
    setIsDragging(true);
  };
  const resetWindow = () => {
    commitPosition(DEFAULT_POSITION);
    setIsDragging(false);
    setIsMaximized(false);
    setLayer(0);
  };
  useEffect(() => registerWindow(resetWindow), [registerWindow]);
  useLayoutEffect(() => {
    const windowElement = windowRef.current;
    const startRect = animationStartRect.current;
    animationStartRect.current = null;
    if (!windowElement || !startRect) return;
    resizeTween.current?.kill();
    const endRect = windowElement.getBoundingClientRect();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.set(windowElement, {
        "--window-animation-x": "0px",
        "--window-animation-y": "0px",
        "--window-animation-scale-x": 1,
        "--window-animation-scale-y": 1
      });
      return;
    }
    resizeTween.current = gsap.fromTo(windowElement, {
      "--window-animation-x": `${startRect.left - endRect.left}px`,
      "--window-animation-y": `${startRect.top - endRect.top}px`,
      "--window-animation-scale-x": startRect.width / endRect.width,
      "--window-animation-scale-y": startRect.height / endRect.height
    }, {
      "--window-animation-x": "0px",
      "--window-animation-y": "0px",
      "--window-animation-scale-x": 1,
      "--window-animation-scale-y": 1,
      duration: 0.58,
      ease: "power3.inOut",
      overwrite: true
    });
    return () => {
      resizeTween.current?.kill();
    };
  }, [isMaximized]);
  useEffect(() => {
    if (!isMaximized) return;
    if (scrollLockCount === 0) {
      previousBodyOverflow = document.body.style.overflow;
      previousHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }
    scrollLockCount += 1;
    return () => {
      scrollLockCount = Math.max(0, scrollLockCount - 1);
      if (scrollLockCount === 0) {
        document.body.style.overflow = previousBodyOverflow;
        document.documentElement.style.overflow = previousHtmlOverflow;
      }
    };
  }, [isMaximized]);
  useEffect(() => {
    const keepTitleBarVisible = () => {
      if (isMaximized) return;
      const windowElement = windowRef.current;
      const titleBar = titleBarRef.current;
      if (!windowElement || !titleBar) return;
      const currentPosition = positionRef.current;
      const constrained = constrainPosition(currentPosition, currentPosition, windowElement.getBoundingClientRect(), titleBar.getBoundingClientRect().height);
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
  const handlePointerDown = event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.pointerType === "touch") {
      pendingTouch.current = {
        pointerId: event.pointerId,
        clientX: event.clientX,
        clientY: event.clientY
      };
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
  const handlePointerMove = event => {
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
    const nextPosition = constrainPosition({
      x: start.origin.x + event.clientX - start.clientX,
      y: start.origin.y + event.clientY - start.clientY
    }, start.origin, start.windowRect, start.titleBarHeight);
    queuePosition(nextPosition);
  };
  const finishDragging = event => {
    if (pendingTouch.current?.pointerId === event.pointerId) pendingTouch.current = null;
    clearTouchTimer();
    const start = dragStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const finalPosition = constrainPosition(positionRef.current, start.origin, start.windowRect, start.titleBarHeight);
    commitPosition(finalPosition);
    dragStart.current = null;
    setIsDragging(false);
  };
  const moveWithKeyboard = (x, y) => {
    if (isMaximized) return;
    const windowElement = windowRef.current;
    const titleBar = titleBarRef.current;
    if (!windowElement || !titleBar) return;
    const currentPosition = positionRef.current;
    bringToFront();
    commitPosition(constrainPosition({
      x: currentPosition.x + x,
      y: currentPosition.y + y
    }, currentPosition, windowElement.getBoundingClientRect(), titleBar.getBoundingClientRect().height));
  };
  const handleKeyDown = event => {
    if (!interactive) return;
    if (event.target !== event.currentTarget) return;
    const step = event.shiftKey ? 64 : 16;
    const directions = {
      ArrowUp: [0, -step],
      ArrowRight: [step, 0],
      ArrowDown: [0, step],
      ArrowLeft: [-step, 0]
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
  const stopWindowDrag = event => {
    event.stopPropagation();
  };
  const toggleMaximize = () => {
    bringToFront();
    animationStartRect.current = windowRef.current?.getBoundingClientRect() ?? null;
    setIsMaximized(maximized => !maximized);
  };
  return <section ref={windowRef} className={`window ${className} ${interactive ? "" : "isStatic"} ${isDragging ? "isDragging" : ""} ${isMaximized ? "isMaximized" : ""}`} style={{
    "--window-x": `${position.x}px`,
    "--window-y": `${position.y}px`,
    zIndex: layer
  }}>
      
      <div ref={titleBarRef} className="windowBar" aria-label={interactive ? `Mover janela ${title}. Use as setas para mover e Home para restaurar a posicao.` : title} role="group" onFocus={interactive ? bringToFront : undefined} onKeyDown={handleKeyDown} onPointerCancel={finishDragging} onPointerDown={handlePointerDown} onPointerEnter={interactive ? bringToFront : undefined} onPointerMove={handlePointerMove} onPointerUp={finishDragging} tabIndex={interactive ? 0 : -1}>
        
        <span className="windowTitle">{title}</span>
        <span className="windowControls">
          <button type="button" className="windowControl maximize" aria-label={isMaximized ? "Restaurar janela" : "Maximizar janela"} data-tooltip={isMaximized ? "Restaurar janela" : "Maximizar janela"} aria-pressed={isMaximized} disabled={!interactive} onClick={toggleMaximize} onPointerDown={stopWindowDrag} />
        </span>
      </div>
      <div className="windowBody">{children}</div>
    </section>;
}
