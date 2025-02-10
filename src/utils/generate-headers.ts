import { ChatHeader } from "../types/header";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function generateHeadersFromMessages(messages: Message[]): ChatHeader[] {
  const headers: ChatHeader[] = [];

  // Keep track of the last user message to attach assistant responses as children
  let currentParentHeader: ChatHeader | null = null;

  messages.forEach((message, index) => {
    if (message.role === "user") {
      // Create a new parent header for user messages
      const header: ChatHeader = {
        id: `message-${index}`,
        title: getHeaderTitle(message.content, "Q: "),
        anchor: `message-${index}`,
        level: 1,
        position: index,
        children: [],
      };

      currentParentHeader = header;
      headers.push(header);
    } else if (message.role === "assistant" && currentParentHeader) {
      // Add assistant messages as children to the last user message
      const childHeader: ChatHeader = {
        id: `message-${index}`,
        title: getHeaderTitle(message.content, "A: "),
        anchor: `message-${index}`,
        level: 2,
        position: index,
      };

      if (!currentParentHeader.children) {
        currentParentHeader.children = [];
      }
      currentParentHeader.children.push(childHeader);
    }
  });

  return headers;
}

const MAX_TITLE_LENGTH = 50;

// Helper function to extract a title from message content
function getHeaderTitle(content: string, prefix: string): string {
  // Try to find the first line or first sentence
  const firstLine = content.split("\n")[0].trim();
  if (firstLine.length <= MAX_TITLE_LENGTH) {
    return prefix + firstLine;
  }

  // If first line is too long, take first sentence or truncate
  const firstSentence = content.split(".")[0].trim();
  if (firstSentence.length <= MAX_TITLE_LENGTH) {
    return prefix + firstSentence;
  }

  // Fallback: truncate to 50 chars
  return (
    prefix +
    firstSentence.substring(0, MAX_TITLE_LENGTH - 3 - prefix.length) +
    "..."
  );
}
