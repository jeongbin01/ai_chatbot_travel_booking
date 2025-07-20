import { useEffect } from "react";

export default function useOnClickOutside(refs, handler) {
  useEffect(() => {
    const listener = (e) => {
      const isInside = refs.some(
        (ref) => ref.current && ref.current.contains(e.target)
      );
      if (!isInside) handler(e);
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [refs, handler]);
}

