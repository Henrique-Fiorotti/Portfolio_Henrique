"use client";

import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";

type WindowLayoutContextValue = {
  registerWindow: (reset: () => void) => () => void;
  resetLayout: () => void;
};

const WindowLayoutContext = createContext<WindowLayoutContextValue | null>(null);

export function WindowLayoutProvider({ children }: { children: ReactNode }) {
  const resetters = useRef(new Set<() => void>());

  const registerWindow = useCallback((reset: () => void) => {
    resetters.current.add(reset);
    return () => resetters.current.delete(reset);
  }, []);

  const resetLayout = useCallback(() => {
    resetters.current.forEach((reset) => reset());
  }, []);

  return (
    <WindowLayoutContext.Provider value={{ registerWindow, resetLayout }}>
      {children}
    </WindowLayoutContext.Provider>
  );
}

export function useWindowLayout() {
  const context = useContext(WindowLayoutContext);

  if (!context) {
    throw new Error("Window components must be rendered inside WindowLayoutProvider.");
  }

  return context;
}

export function WindowLayoutControls() {
  const { resetLayout } = useWindowLayout();

  return (
    <div className="windowLayoutControls" aria-label="Controles de layout das janelas">
      <button
        type="button"
        className="windowLayoutControl"
        aria-label="Restaurar layout das janelas"
        data-tooltip="Restaurar layout"
        onClick={resetLayout}
      >
        <RotateCcw aria-hidden="true" />
      </button>
    </div>
  );
}
