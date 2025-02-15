import {
  useAnimation,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";
import { ANIMATION, SCREEN_BREAKPOINTS } from "~/app/page";

export const usePanelAnimation = () => {
  const chatControls = useAnimation();
  const panelControls = useAnimation();
  const chatX = useMotionValue(0);
  const panelX = useMotionValue(-window.innerWidth);
  const chatOpacity = useTransform(
    chatX,
    [0, window.innerWidth * 0.5],
    [ANIMATION.OPACITY.INITIAL, ANIMATION.OPACITY.FINAL]
  );

  const snapTo = async (targetChatX: number) => {
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
  };

  const handleDragStart = () => {
    chatControls.stop();
    panelControls.stop();
  };

  const handleDrag = (source: "panel" | "chat", _: unknown, info: PanInfo) => {
    const screenWidth = window.innerWidth;

    if (source === "panel") {
      const newPanelX = panelX.get() + info.delta.x;
      const newChatX = (newPanelX + screenWidth) * 0.5;

      if (newPanelX <= 0 && newPanelX >= -screenWidth) {
        panelX.set(newPanelX);
        chatX.set(newChatX);
        chatControls.set({ x: newChatX });
      }
    } else {
      const newChatX = chatX.get() + info.delta.x;
      const newPanelX = newChatX * 2 - screenWidth;

      if (newChatX >= 0 && newChatX <= screenWidth * 0.5) {
        chatX.set(newChatX);
        panelX.set(newPanelX);
        panelControls.set({ x: newPanelX });
      }
    }
  };

  const handleDragEnd = (
    source: "panel" | "chat",
    _: unknown,
    info: PanInfo
  ) => {
    const screenWidth = window.innerWidth;

    if (source === "panel") {
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
    } else {
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
    }
  };

  const chatProps = {
    animate: chatControls,
    style: { x: chatX, opacity: chatOpacity },
    onDragStart: handleDragStart,
    onDrag: (_: unknown, info: PanInfo) => handleDrag("chat", _, info),
    onDragEnd: (_: unknown, info: PanInfo) => handleDragEnd("chat", _, info),
  };

  const panelProps = {
    animate: panelControls,
    style: { x: panelX },
    onDragStart: handleDragStart,
    onDrag: (_: unknown, info: PanInfo) => handleDrag("panel", _, info),
    onDragEnd: (_: unknown, info: PanInfo) => handleDragEnd("panel", _, info),
  };

  return {
    chatProps,
    panelProps,
  };
};
