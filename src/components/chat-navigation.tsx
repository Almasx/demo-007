"use client";

import { useCallback, useState, useRef, useMemo, useEffect } from "react";
import { ChatHeader } from "~/types";
import { Reply } from "lucide-react";
import { cn } from "~/utils";
import { useActiveHeader } from "~/hooks/useActiveHeader";
import { AnimatePresence, motion } from "motion/react";
import useMeasure from "react-use-measure";
import { playHapticFeedback } from "~/utils/haptic";

interface ChatNavigationProps {
  headers: ChatHeader[];
}

const flattenHeaders = (headers: ChatHeader[]): ChatHeader[] => {
  return headers.flatMap((header) => [
    header,
    ...flattenHeaders(header.children || []),
  ]);
};

export const ChatNavigationPanel: React.FC<ChatNavigationProps> = ({
  headers,
}) => {
  const [activeHeader, setActiveHeader] = useState<ChatHeader | null>(null);
  const [activeHeaderRef, activeHeaderBounds] = useMeasure();
  const containerRef = useRef<HTMLDivElement>(null);

  const flattenedHeaders = useMemo(() => flattenHeaders(headers), [headers]);

  // Define a helper function to simulate haptic feedback with sound and vibration

  useActiveHeader({
    onActiveHeaderChange: (headerId) => {
      if (headerId) {
        const header = flattenedHeaders.find((h) => h.id === headerId)!;
        setActiveHeader(header);
        handleHeaderClick(header);
      } else {
        setActiveHeader(null);
      }
    },
  });

  // Play haptic feedback whenever the active header changes
  useEffect(() => {
    if (activeHeader) {
      playHapticFeedback();
    }
  }, [activeHeader]);

  const handleHeaderClick = useCallback((header: ChatHeader) => {
    setActiveHeader(header);

    const element = document.getElementById(header.anchor);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 20, behavior: "instant" });
    }
  }, []);

  const renderHeader = (header: ChatHeader, depth: number = 0) => {
    const isActive = header.id === activeHeader?.id;
    const isChild = depth > 0;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      handleHeaderClick(header);

      const element = e.currentTarget;
      const container = containerRef.current;

      if (container) {
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const scrollTop =
          container.scrollTop +
          (elementRect.top - containerRect.top) -
          containerRect.height / 2;

        container.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
    };

    return (
      <div key={header.id} className="flex flex-col gap-2">
        <button
          ref={isActive ? activeHeaderRef : null}
          data-header-id={header.id}
          onClick={handleClick}
          className={cn(
            "group w-fit flex items-center gap-2.5 !h-16 text-lg px-3 py-2 relative rounded-2xl transition-colors",
            "hover:bg-[#F4F4F4]/50",
            isChild && "ml-4"
          )}
        >
          {isChild && (
            <span className="text-[#D7D7D7]">
              <Reply className="w-4 h-4 rotate-180" />
            </span>
          )}
          <span className={cn("text-[#5D5D5D] leading-5 ")}>
            {header.title}
          </span>
        </button>
        {header.children?.map((child) => renderHeader(child, depth + 1))}
      </div>
    );
  };

  return (
    <div
      className="w-screen h-screen relative will-change-transform"
      style={{
        background:
          "linear-gradient(to right, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.2))",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(4px)",
          maskImage: "linear-gradient(to right, black 80%, transparent 100%)",
        }}
      />
      <div
        className="flex flex-col gap-2 p-2 h-screen pt-[50vh] pb-[calc(50vh-64px)] no-scrollbar overflow-y-auto overflow-x-hidden transform-gpu"
        ref={containerRef}
      >
        {headers.map((header) => renderHeader(header))}
      </div>
      <ActiveHeader
        activeHeader={activeHeader}
        activeHeaderBounds={activeHeaderBounds}
      />
    </div>
  );
};

interface ActiveHeaderProps {
  activeHeader: ChatHeader | null;
  activeHeaderBounds: { width: number; left: number };
}

const ActiveHeader = ({
  activeHeader,
  activeHeaderBounds,
}: ActiveHeaderProps) => {
  // const [scrolling, setScrolling] = useState(false);

  // useEffect(() => {
  //   const handleTouchStart = () => {
  //     setScrolling(true);
  //   };

  //   const handleTouchEnd = () => {
  //     setScrolling(false);
  //   };

  //   window.addEventListener("touchstart", handleTouchStart, { passive: true });
  //   window.addEventListener("touchend", handleTouchEnd, { passive: true });

  //   return () => {
  //     window.removeEventListener("touchstart", handleTouchStart);
  //     window.removeEventListener("touchend", handleTouchEnd);
  //   };
  // }, []);

  const text = useMemo(() => {
    switch (true) {
      case activeHeader?.level && activeHeader.level > 1:
        return (
          <>
            <span className="text-[#5D5D5D]">
              <Reply className="w-4 h-4 rotate-180" />
            </span>
            <span className="text-[#5D5D5D] leading-5 whitespace-nowrap w-full">
              {activeHeader?.title}
            </span>
          </>
        );
      case !!activeHeader?.title:
        return (
          <span className="text-[#5D5D5D] leading-5 whitespace-nowrap w-full">
            {activeHeader?.title}
          </span>
        );
      default:
        return null;
    }
  }, [activeHeader]);

  console.log(activeHeader?.level);

  const width = activeHeader ? activeHeaderBounds.width : 200;
  const left =
    activeHeader && activeHeaderBounds.left
      ? activeHeaderBounds.left
      : window.innerWidth / 2 - 100;

  console.log();

  return (
    <motion.div
      transition={{
        duration: 0.1,
        type: "spring",
        bounce: 0,
      }}
      animate={{
        width,
        x: left,
        opacity: activeHeaderBounds.left < 1 ? 0 : 1,
      }}
      className="rounded-2xl absolute overflow-hidden h-16 left-2 text-lg top-1/2 bg-[#f4f4f4] -translate-y-1/2 will-change-transform transform-gpu"
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          className="gap-2.5 px-3 py-2 flex items-center h-16"
          key={activeHeader?.id}
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          transition={{ duration: 0.05 }}
        >
          {text}
        </motion.div>
      </AnimatePresence>
      <div className="absolute right-0 top-0 w-10 h-full bg-gradient-to-r from-transparent to-[#f4f4f4]" />
    </motion.div>
  );
};
