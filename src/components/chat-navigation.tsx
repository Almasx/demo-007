"use client";

import { useCallback, useState, useRef, useMemo } from "react";
import { ChatHeader } from "~/types";
import { Reply } from "lucide-react";
import { cn } from "~/utils";
import { useActiveHeader } from "~/hooks/useActiveHeader";
import { motion } from "motion/react";
import useMeasure from "react-use-measure";

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

  useActiveHeader({
    containerRef,
    onActiveHeaderChange: (headerId) => {
      const header = flattenedHeaders.find((h) => h.id === headerId);
      if (header) {
        setActiveHeader(header);
        handleHeaderClick(header);
      } else {
        setActiveHeader(null);
      }
    },
  });

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

    return (
      <div key={header.id} className="flex flex-col gap-2">
        <button
          ref={isActive ? activeHeaderRef : null}
          data-header-id={header.id}
          onClick={() => handleHeaderClick(header)}
          className={cn(
            "group flex items-center gap-2.5 h-9 px-3 py-2 relative rounded-xl transition-colors",
            "hover:bg-[#F4F4F4]/50",
            isChild && "ml-4"
          )}
        >
          {isChild && (
            <span className="text-[#D7D7D7]">
              <Reply className="w-4 h-4 rotate-180" />
            </span>
          )}
          <span
            className={cn(
              "text-[#5D5D5D] leading-5 truncate",
              isActive && "font-medium"
            )}
          >
            {header.title}
          </span>
          {isActive && (
            <motion.div
              transition={{ duration: 0.1, type: "spring", bounce: 0 }}
              className="rounded-xl inset-0 bg-[#F4F4F4] gap-2.5 absolute px-3 py-2 h-full flex items-center"
              layoutId="active"
            >
              {isChild && (
                <span className="text-[#5D5D5D]">
                  <Reply className="w-4 h-4 rotate-180" />
                </span>
              )}
              <motion.span className="text-[#5D5D5D] leading-5 truncate">
                {header.title}
              </motion.span>
            </motion.div>
          )}
        </button>
        {header.children?.map((child) => renderHeader(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="w-[375px] relative bg-white">
      <div
        className="flex flex-col gap-2 p-2 h-screen py-[calc(50vh)] overflow-y-auto overflow-x-hidden"
        ref={containerRef}
      >
        {headers.map((header) => renderHeader(header))}
      </div>
      {/* <ActiveHeader
        activeHeader={activeHeader}
        activeHeaderBounds={activeHeaderBounds}
      /> */}
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
  return (
    <motion.div
      transition={{ duration: 0.1, type: "spring", bounce: 0 }}
      animate={{
        width: activeHeader ? activeHeaderBounds.width : 0,
        x: activeHeader ? activeHeaderBounds.left : 0,
      }}
      className="rounded-xl absolute left-2 h-9 top-1/2 -translate-y-1/2 bg-[#F4F4F4] gap-2.5  px-3 py-2 flex items-center"
    >
      {activeHeader?.level && activeHeader.level > 0 && (
        <span className="text-[#5D5D5D]">
          <Reply className="w-4 h-4 rotate-180" />
        </span>
      )}
      <span className="text-[#5D5D5D] leading-5 truncate w-full">
        {activeHeader?.title}
      </span>
    </motion.div>
  );
};
