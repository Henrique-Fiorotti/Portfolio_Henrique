import type { ReactNode } from "react";

type WindowProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function Window({ title, children, className = "" }: WindowProps) {
  return (
    <section className={`window ${className}`}>
      <div className="windowBar">
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
