import { useEffect, useRef } from "react";

interface useActiveHeaderProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onActiveHeaderChange: (headerId: string) => void;
}

export const useActiveHeader = ({
  containerRef,
  onActiveHeaderChange,
}: useActiveHeaderProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const entriesRef = useRef<Map<string, IntersectionObserverEntry>>(new Map());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rootMargin = `${Math.round(-(container?.clientHeight / 2) - 36)}px`;

    const options = {
      root: container,
      rootMargin: `${rootMargin} 0px`,
      threshold: Array.from({ length: 100 }, (_, i) => i / 100),
    } as IntersectionObserverInit;

    const updateActiveHeader = () => {
      let activeEntry: IntersectionObserverEntry | null = null;

      entriesRef.current.forEach((entry) => {
        if (entry.isIntersecting) {
          activeEntry = entry;
        }
      });

      if (activeEntry !== null) {
        const button = (activeEntry as IntersectionObserverEntry)
          .target as unknown as HTMLButtonElement;
        const id = button.dataset.headerId;
        if (!id) return;
        onActiveHeaderChange(id);
      }
    };

    // Intersection observer callback
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const button = entry.target as HTMLButtonElement;
        const id = button.dataset.headerId;
        if (!id) return;

        if (entry.isIntersecting) {
          entriesRef.current.set(id, entry);
        } else {
          entriesRef.current.delete(id);
        }
      });

      updateActiveHeader();
    };

    // Create and setup observer
    observerRef.current = new IntersectionObserver(callback, options);

    // Observe all header buttons in the navigation
    const headerButtons = container.querySelectorAll("button[data-header-id]");
    headerButtons.forEach((button) => {
      observerRef.current?.observe(button);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      entriesRef.current.clear();
    };
  }, [containerRef]);
};
