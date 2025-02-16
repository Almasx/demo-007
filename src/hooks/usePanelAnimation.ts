import {
  useAnimation,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";
import { ANIMATION, SCREEN_BREAKPOINTS } from "~/app/page";
import { useCallback, useState } from "react";
export const usePanelAnimation = () => {
  const [state, setState] = useState<"chat" | "panel">("chat");

  const chatControls = useAnimation();
  const panelControls = useAnimation();

  const chatX = useMotionValue(0);
  const panelX = useMotionValue(-window.innerWidth);

  const chatOpacity = useTransform(
    chatX,
    [0, window.innerWidth * 0.5],
    [ANIMATION.OPACITY.INITIAL, ANIMATION.OPACITY.FINAL]
  );

  const snapTo = useCallback(
    async (targetChatX: number) => {
      const targetPanelX = targetChatX === 0 ? -window.innerWidth : 0;

      await Promise.all([
        chatControls.start({
          x: targetChatX,
          transition: ANIMATION.TRANSITION,
        }),
        panelControls.start({
          x: targetPanelX,
          transition: ANIMATION.TRANSITION,
        }),
      ]);

      chatX.set(targetChatX);
      panelX.set(targetPanelX);
      setState(targetChatX === 0 ? "chat" : "panel");
    },
    [chatControls, panelControls, chatX, panelX, setState]
  );

  const handleDragStart = useCallback(() => {
    chatControls.stop();
    panelControls.stop();
  }, [chatControls, panelControls]);

  const handlePanelDrag = useCallback(
    (info: PanInfo) => {
      const screenWidth = window.innerWidth;

      const newPanelX = panelX.get() + info.delta.x;
      const newChatX = (newPanelX + screenWidth) * 0.5;

      if (newPanelX <= 0 && newPanelX >= -screenWidth) {
        panelX.set(newPanelX);
        chatX.set(newChatX);
        chatControls.set({ x: newChatX });
      }
    },
    [chatControls, panelX, chatX]
  );

  const handleChatDrag = useCallback(
    (info: PanInfo) => {
      const screenWidth = window.innerWidth;
      const newChatX = chatX.get() + info.delta.x;
      const newPanelX = newChatX * 2 - screenWidth;

      if (newChatX >= 0 && newChatX <= screenWidth * 0.5) {
        chatX.set(newChatX);
        panelX.set(newPanelX);
        panelControls.set({ x: newPanelX });
      }
    },
    [chatX, panelX, panelControls]
  );

  const handlePanelDragEnd = useCallback(
    (info: PanInfo) => {
      const screenWidth = window.innerWidth;
      const normalizedX = (panelX.get() + screenWidth) / screenWidth;
      const velocity = -info.velocity.x;

      if (
        normalizedX > SCREEN_BREAKPOINTS.PANEL_OPEN_THRESHOLD &&
        velocity < ANIMATION.VELOCITY_SNAP_POINT
      ) {
        snapTo(screenWidth * 0.5);
      } else {
        snapTo(0);
      }
    },
    [panelX, snapTo]
  );

  const handleChatDragEnd = useCallback(
    (info: PanInfo) => {
      const screenWidth = window.innerWidth;
      const normalizedX = chatX.get() / screenWidth;
      const velocity = info.velocity.x;

      if (
        normalizedX > SCREEN_BREAKPOINTS.CHAT_OPEN_THRESHOLD ||
        (normalizedX > SCREEN_BREAKPOINTS.DYNAMIC_SNAP_POINT &&
          velocity > ANIMATION.VELOCITY_SNAP_POINT)
      ) {
        snapTo(screenWidth * 0.5);
      } else {
        snapTo(0);
      }
    },
    [chatX, snapTo]
  );

  const chatProps = {
    animate: chatControls,
    style: { x: chatX, opacity: chatOpacity },
    onDragStart: handleDragStart,
    onDrag: (_: unknown, info: PanInfo) => handleChatDrag(info),
    onDragEnd: (_: unknown, info: PanInfo) => handleChatDragEnd(info),
  };

  const panelProps = {
    animate: panelControls,
    style: { x: panelX },
    onDragStart: handleDragStart,
    onDrag: (_: unknown, info: PanInfo) => handlePanelDrag(info),
    onDragEnd: (_: unknown, info: PanInfo) => handlePanelDragEnd(info),
  };

  return {
    chatProps,
    panelProps,
    state,
  };
};
