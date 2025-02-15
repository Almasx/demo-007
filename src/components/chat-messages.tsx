import { Message } from "~/types/message";
import { Markdown } from "./markdown";

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  return (
    <div className="flex flex-col px-[13px] py-4 space-y-[37px] w-[375px]">
      {messages.map((message, index) => (
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
  );
};
