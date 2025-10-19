import { useEffect } from "react";

export function useOutsideClick(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const onClickHandler = (e: MouseEvent) => {
      const current = ref.current;
      if (!current) return;
      if (!current.contains(e.target as Node)) handler();
    };

    document.addEventListener("mousedown", onClickHandler);
    return () => document.removeEventListener("mousedown", onClickHandler);
  }, [ref, handler]);
}
