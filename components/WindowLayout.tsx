"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Grid3X3, RotateCcw } from "lucide-react";

type WindowLayoutContextValue = {
  registerWindow: (reset: () => void) => () => void;
  resetLayout: () => void;
  snapEnabled: boolean;
  toggleSnap: () => void;
};

const WindowLayoutContext = createContext<WindowLayoutContextValue | null>(null);

export function WindowLayoutProvider({ children }: { children: ReactNode }) {
  const resetters = useRef(new Set<() => void>());
  const [snapEnabled, setSnapEnabled] = useState(true);

  const registerWindow = useCallback((reset: () => void) => {
    resetters.current.add(reset);
    return () => resetters.current.delete(reset);
  }, []);

  const resetLayout = useCallback(() => {
    resetters.current.forEach((reset) => reset());
  }, []);

  const toggleSnap = useCallback(() => {
    setSnapEnabled((enabled) => !enabled);
  }, []);

  return (
    <WindowLayoutContext.Provider value={{ registerWindow, resetLayout, snapEnabled, toggleSnap }}>
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
  const { resetLayout, snapEnabled, toggleSnap } = useWindowLayout();

  return (
    <div className="windowLayoutControls" aria-label="Controles de layout das janelas">
      <button
        type="button"
        className="windowLayoutControl"
        aria-label={snapEnabled ? "Desativar encaixe das janelas" : "Ativar encaixe das janelas"}
        aria-pressed={snapEnabled}
        data-tooltip={snapEnabled ? "Encaixe ativado" : "Encaixe desativado"}
        onClick={toggleSnap}
      >
        <Grid3X3 aria-hidden="true" />
      </button>
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
