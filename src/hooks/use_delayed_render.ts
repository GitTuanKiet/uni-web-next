import { useState, useEffect, type ReactNode } from "react";

type useDelayedRenderReturnType = (fn: () => ReactNode) => ReactNode;

export const useDelayedRender = (delay: number): useDelayedRenderReturnType => {
  const [delayed, setDelayed] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setDelayed(false), delay);
    return () => clearTimeout(timeout);
  }, []);
  return (fn: () => ReactNode) => !delayed && fn();
};

export default useDelayedRender;
