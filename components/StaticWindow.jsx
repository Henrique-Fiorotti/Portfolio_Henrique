// Static content keeps the desktop-window appearance without drag/resize listeners.
export function StaticWindow({ title, children, className = "", showMaximize = true }) {
  return <section className={`window ${className} isStatic`}>
    <div className="windowBar" aria-label={title} role="group">
      <span className="windowTitle">{title}</span>
      {showMaximize && <span className="windowControls" aria-hidden="true">
        <span className="windowControl maximize" />
      </span>}
    </div>
    <div className="windowBody">{children}</div>
  </section>;
}
