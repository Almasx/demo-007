"use client";

import { Markdown } from "~/components/markdown";
import { ChatNavigationPanel } from "~/components/chat-navigation";
import { generateHeadersFromMessages } from "~/utils/generate-headers";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  PanInfo,
} from "framer-motion";
import { mockMessages } from "~/const";

const STATIC_SNAP_POINT = 50;
const DYNAMIC_SNAP_POINT = 50;
const VELOCITY_SNAP_POINT = 100;

const SNAP_POINTS = {
  x: { initial: 0, end: 200 },
  scale: { initial: 1, end: 0.8 },
  panel: { initial: "-100%", end: "0%" },
  opacity: { initial: 1, end: 0.5 },
};

const TRANSITION = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.8,
  velocity: 50,
};

export default function Home() {
  const headers = generateHeadersFromMessages(mockMessages);

  const chatX = useMotionValue(0);
  const chatScale = useTransform(
    chatX,
    [SNAP_POINTS.x.initial, SNAP_POINTS.x.end],
    [SNAP_POINTS.scale.initial, SNAP_POINTS.scale.end]
  );
  const chatOpacity = useTransform(
    chatX,
    [SNAP_POINTS.x.initial, SNAP_POINTS.x.end],
    [SNAP_POINTS.opacity.initial, SNAP_POINTS.opacity.end]
  );

  const panelX = useTransform(
    chatX,
    [SNAP_POINTS.x.initial, SNAP_POINTS.x.end],
    [SNAP_POINTS.panel.initial, SNAP_POINTS.panel.end]
  );

  const mainRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const snapTo = async (targetX: number) => {
    await controls.start({
      x: targetX,
      transition: TRANSITION,
    });

    chatX.set(targetX);
  };

  const handlePanelDismiss = () => {
    snapTo(SNAP_POINTS.x.initial);
  };

  const handlePanStart = () => {
    controls.stop();
  };

  const handlePanEnd = (_: unknown, info: PanInfo) => {
    const currentX = chatX.get();
    const velocity = info.velocity.x;

    // Snap points logic with velocity influence
    if (
      currentX > STATIC_SNAP_POINT ||
      (currentX > DYNAMIC_SNAP_POINT && velocity > VELOCITY_SNAP_POINT)
    ) {
      snapTo(SNAP_POINTS.x.end);
    } else {
      snapTo(SNAP_POINTS.x.initial);
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      <motion.div style={{ x: panelX }} className="h-0 sticky top-0 z-10">
        <ChatNavigationPanel headers={headers} onDismiss={handlePanelDismiss} />
      </motion.div>

      <div className="w-screen overflow-x-hidden">
        <motion.main
          ref={mainRef}
          className=" shrink-0 cursor-grab overflow-x-hidden active:cursor-grabbing"
          style={{
            x: chatX,
            scale: chatScale,
            transformOrigin: "left top",
            opacity: chatOpacity,
          }}
          animate={controls}
          drag="x"
          dragConstraints={{ left: 0, right: 200 }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={handlePanStart}
          onDragEnd={handlePanEnd}
          whileTap={{ cursor: "grabbing" }}
        >
          <div className="flex flex-col px-[13px] py-4 space-y-[37px] w-[375px]">
            {mockMessages.map((message, index) => (
              <article
                key={index}
                id={`message-${index}`}
                className={
                  message.role === "assistant"
                    ? "flex flex-col space-y-2"
                    : "flex justify-end"
                }
              >
                {message.role === "assistant" ? (
                  <Markdown className="prose max-w-[600px] -space-y-3 text-[#0D0D0D]">
                    {message.content}
                  </Markdown>
                ) : (
                  <div className="bg-[#E8E8E8]/50 rounded-[24px] px-5 py-[10px] text-[#0D0D0D] leading-6 max-w-[70%]">
                    {message.content}
                  </div>
                )}
              </article>
            ))}
          </div>
        </motion.main>
      </div>
    </div>
  );
}
