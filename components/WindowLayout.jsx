"use client";

import { createContext, useCallback, useContext, useRef } from "react";
import { RotateCcw } from "lucide-react";
const WindowLayoutContext = createContext(null);
export function WindowLayoutProvider({
  children
}) {
  const resetters = useRef(new Set());
  const registerWindow = useCallback(reset => {
    resetters.current.add(reset);
    return () => resetters.current.delete(reset);
  }, []);
  const resetLayout = useCallback(() => {
    resetters.current.forEach(reset => reset());
  }, []);
  return <WindowLayoutContext.Provider value={{
    registerWindow,
    resetLayout
  }}>
      {children}
    </WindowLayoutContext.Provider>;
}
export function useWindowLayout() {
  const context = useContext(WindowLayoutContext);
  if (!context) {
    throw new Error("Window components must be rendered inside WindowLayoutProvider.");
  }
  return context;
}
export function WindowLayoutControls() {
  const {
    resetLayout
  } = useWindowLayout();
  return <div className="windowLayoutControls" aria-label="Controles de layout das janelas">
      <button type="button" className="windowLayoutControl" aria-label="Restaurar layout das janelas" data-tooltip="Restaurar layout" onClick={resetLayout}>
        
        <RotateCcw aria-hidden="true" />
      </button>
    </div>;
}
