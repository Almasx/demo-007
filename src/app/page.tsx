"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChatNavigationPanel } from "~/components/chat-navigation";
import { ChatMessages } from "~/components/chat-messages";
import { generateHeadersFromMessages } from "~/utils/generate-headers";
import { usePanelAnimation } from "~/hooks/usePanelAnimation";
import { mockMessages } from "~/const";

export default function Home() {
  const headers = generateHeadersFromMessages(mockMessages);
  const mainRef = useRef<HTMLDivElement>(null);
  const { chatProps, panelProps } = usePanelAnimation();

  return (
    <div className="min-h-screen bg-white relative">
      <motion.div
        {...panelProps}
        {...DRAG_CONFIG}
        className="h-0 sticky top-0 z-10 w-screen"
        drag="x"
        dragConstraints={{ left: -window.innerWidth, right: 0 }}
      >
        <ChatNavigationPanel headers={headers} />
      </motion.div>

      <div className="w-screen overflow-x-hidden">
        <motion.main
          {...chatProps}
          {...DRAG_CONFIG}
          ref={mainRef}
          className="shrink-0 cursor-grab overflow-x-hidden active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: window.innerWidth * 0.5 }}
        >
          <ChatMessages messages={mockMessages} />
        </motion.main>
      </div>
    </div>
  );
}

export const SCREEN_BREAKPOINTS = {
  PANEL_OPEN_THRESHOLD: 0.7,
  CHAT_OPEN_THRESHOLD: 0.3,
  DYNAMIC_SNAP_POINT: 0.1,
} as const;

export const ANIMATION = {
  VELOCITY_SNAP_POINT: 50,
  TRANSITION: {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 0.8,
    velocity: 50,
  },
  SNAP_POINTS: {
    CHAT: {
      CLOSED: 0,
      OPEN: "50%",
    },
    PANEL: {
      CLOSED: "-100%",
      OPEN: "0%",
    },
  },
  OPACITY: {
    INITIAL: 1,
    FINAL: 0.8,
  },
} as const;

export const DRAG_CONFIG = {
  dragElastic: 0.1,
  dragMomentum: false,
} as const;
