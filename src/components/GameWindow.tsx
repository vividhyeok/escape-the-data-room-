import { useEffect, useMemo, useRef, useState } from "react";

export type GameWindowType = "inspect" | "python" | "reference" | "keypad" | "notebook" | "review";

type WindowRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type GameWindowProps = {
  id: string;
  type: GameWindowType;
  eyebrow: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  borderless?: boolean;
};

const STORAGE_PREFIX = "escape-the-data-room:window:";

const DEFAULT_WINDOW_SIZES: Record<GameWindowType, Pick<WindowRect, "width" | "height">> = {
  inspect:   { width: 980, height: 640 },
  python:    { width: 720, height: 580 },
  reference: { width: 440, height: 540 },
  keypad:    { width: 420, height: 520 },
  notebook:  { width: 420, height: 580 },
  review:    { width: 720, height: 620 },
};

const DEFAULT_WINDOW_POSITIONS: Record<GameWindowType, Pick<WindowRect, "x" | "y">> = {
  inspect: { x: 220, y: 110 },
  python: { x: 760, y: 220 },
  reference: { x: 300, y: 220 },
  keypad: { x: 520, y: 160 },
  notebook: { x: 80, y: 180 },
  review: { x: 420, y: 130 },
};

const MIN_WINDOW_SIZE = {
  width: 500,
  height: 400,
};

let topWindowZ = 100;

function nextZIndex(): number {
  topWindowZ += 1;
  return topWindowZ;
}

function getViewportRect(): Pick<WindowRect, "width" | "height"> {
  if (typeof window === "undefined") {
    return { width: 1280, height: 720 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function clampRect(rect: WindowRect): WindowRect {
  const viewport = getViewportRect();
  const width = Math.min(Math.max(rect.width, MIN_WINDOW_SIZE.width), Math.max(MIN_WINDOW_SIZE.width, viewport.width - 32));
  const height = Math.min(Math.max(rect.height, MIN_WINDOW_SIZE.height), Math.max(MIN_WINDOW_SIZE.height, viewport.height - 32));
  const x = Math.min(Math.max(rect.x, 12), Math.max(12, viewport.width - width - 12));
  const y = Math.min(Math.max(rect.y, 12), Math.max(12, viewport.height - height - 12));

  return { x, y, width, height };
}

function defaultRect(type: GameWindowType, id: string): WindowRect {
  const size = DEFAULT_WINDOW_SIZES[type];
  const position = DEFAULT_WINDOW_POSITIONS[type];
  const viewport = getViewportRect();
  
  if (type === "inspect") {
    return clampRect({
      x: Math.floor(viewport.width / 2) - Math.floor(size.width / 2),
      y: Math.max(60, Math.floor(viewport.height / 2) - Math.floor(size.height / 2)),
      width: size.width,
      height: size.height,
    });
  }
  
  const cascade = Math.abs(Array.from(id).reduce((total, char) => total + char.charCodeAt(0), 0)) % 5;

  return clampRect({
    x: position.x + cascade * 18,
    y: position.y + cascade * 14,
    width: size.width,
    height: size.height,
  });
}

function loadRect(type: GameWindowType, id: string): WindowRect {
  if (typeof window === "undefined") {
    return defaultRect(type, id);
  }

  try {
    const stored = window.localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (!stored) {
      return defaultRect(type, id);
    }
    
    // Ignore stored values for inspect (borderless) so they always spawn in center when opened,
    // or we can let them remember. Let's let them remember, but if they were tiny, fix it.
    const rect = JSON.parse(stored) as WindowRect;
    if (type === "inspect" && (rect.width < 100 || rect.height < 100)) {
      return defaultRect(type, id);
    }

    return clampRect(rect);
  } catch {
    return defaultRect(type, id);
  }
}

function saveRect(id: string, rect: WindowRect): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(rect));
}

export function resetGameWindows(): void {
  if (typeof window === "undefined") {
    return;
  }

  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(STORAGE_PREFIX))
    .forEach((key) => window.localStorage.removeItem(key));
  window.dispatchEvent(new CustomEvent("etdr:reset-windows"));
}

export function setDemoLayout(): void {
  if (typeof window === "undefined") {
    return;
  }

  const viewport = getViewportRect();
  const inspectW = Math.min(580, Math.floor(viewport.width * 0.44));
  const pythonW = Math.min(540, Math.floor(viewport.width * 0.42));
  const winH = Math.min(490, Math.floor(viewport.height * 0.66));
  const topY = Math.max(80, Math.floor(viewport.height * 0.11));

  saveRect("inspect-room-1-word-billboard", clampRect({ x: 80, y: topY, width: inspectW, height: winH }));
  saveRect("python-room-1-word-billboard", clampRect({ x: 80 + inspectW + 18, y: topY, width: pythonW, height: winH }));
  window.dispatchEvent(new CustomEvent("etdr:reload-windows"));
}

export function GameWindow({ id, type, eyebrow, title, onClose, children, borderless }: GameWindowProps): React.JSX.Element {
  const initialRect = useMemo(() => loadRect(type, id), [id, type]);
  const [rect, setRect] = useState<WindowRect>(initialRect);
  const [zIndex, setZIndex] = useState(() => nextZIndex());
  const dragRef = useRef<{
    mode: "drag" | "resize";
    pointerId: number;
    startX: number;
    startY: number;
    rect: WindowRect;
  } | null>(null);

  useEffect(() => {
    function handleReset(): void {
      setRect(defaultRect(type, id));
      setZIndex(nextZIndex());
    }

    function handleReload(): void {
      setRect(loadRect(type, id));
      setZIndex(nextZIndex());
    }

    window.addEventListener("etdr:reset-windows", handleReset);
    window.addEventListener("etdr:reload-windows", handleReload);
    return () => {
      window.removeEventListener("etdr:reset-windows", handleReset);
      window.removeEventListener("etdr:reload-windows", handleReload);
    };
  }, [id, type]);

  useEffect(() => {
    function handleResize(): void {
      setRect((current) => clampRect(current));
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    saveRect(id, rect);
  }, [id, rect]);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent): void {
      const active = dragRef.current;
      if (!active || active.pointerId !== event.pointerId) {
        return;
      }

      const dx = event.clientX - active.startX;
      const dy = event.clientY - active.startY;

      if (active.mode === "drag") {
        setRect(clampRect({ ...active.rect, x: active.rect.x + dx, y: active.rect.y + dy }));
        return;
      }

      setRect(
        clampRect({
          ...active.rect,
          width: active.rect.width + dx,
          height: active.rect.height + dy,
        }),
      );
    }

    function handlePointerUp(event: PointerEvent): void {
      if (dragRef.current?.pointerId === event.pointerId) {
        dragRef.current = null;
        document.body.style.userSelect = "";
      }
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  function focusWindow(): void {
    setZIndex(nextZIndex());
  }

  function startDrag(event: React.PointerEvent<HTMLDivElement>): void {
    if (event.button !== 0) {
      return;
    }
    
    // Ignore drag if clicking on interactive elements
    const target = event.target as HTMLElement;
    if (target.closest('button, input, textarea, a, .no-drag')) {
      return;
    }

    focusWindow();
    document.body.style.userSelect = "none";
    dragRef.current = {
      mode: "drag",
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      rect,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function startResize(event: React.PointerEvent<HTMLDivElement>): void {
    event.preventDefault();
    event.stopPropagation();
    focusWindow();
    document.body.style.userSelect = "none";
    dragRef.current = {
      mode: "resize",
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      rect,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  return (
    <section
      aria-label={`${eyebrow} ${title}`}
      className={`game-window game-window-${type} ${borderless ? 'borderless' : ''}`}
      onPointerDown={focusWindow}
      style={{
        left: rect.x,
        top: rect.y,
        width: borderless ? undefined : rect.width,
        height: borderless ? undefined : rect.height,
        zIndex,
      }}
    >
      {!borderless && (
        <div className="game-window-titlebar" onPointerDown={startDrag}>
          <div>
            <span>{eyebrow}</span>
            <strong>{title}</strong>
          </div>
          <button
            aria-label="Close Terminal"
            className="window-close"
            onClick={onClose}
            onPointerDown={(e) => e.stopPropagation()}
            type="button"
          >
            SYS.EXIT
          </button>
        </div>
      )}
      
      {borderless ? (
        <div className="game-window-body borderless-body" onPointerDown={startDrag} style={{ height: '100%', cursor: 'grab' }}>
          {children}
        </div>
      ) : (
        <div className="game-window-body">{children}</div>
      )}

      {!borderless && <div aria-hidden="true" className="resize-handle" onPointerDown={startResize} />}
    </section>
  );
}
