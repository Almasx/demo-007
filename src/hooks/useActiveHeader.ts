import { useEffect, useRef } from "react";

interface useActiveHeaderProps {
  onActiveHeaderChange: (headerId: string) => void;
}

export const useActiveHeader = ({
  onActiveHeaderChange,
}: useActiveHeaderProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const entriesRef = useRef<Map<string, IntersectionObserverEntry>>(new Map());

  const rootMargin = `${Math.round(-(window.innerHeight / 2) - 32)}px`;

  useEffect(() => {
    const options = {
      rootMargin: `${rootMargin} 0px`,
      threshold: [0, 1.0],
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
    const headerButtons = document.querySelectorAll("button[data-header-id]");
    headerButtons.forEach((button) => {
      observerRef.current?.observe(button);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      entriesRef.current.clear();
    };
  }, []);
};
