import { createContext, useContext, useState } from "react";
import { submitInquiry } from "../services/chatService";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(null);

const INITIAL_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content:
    "Ask about budgets, BHKs, neighborhoods, or site visits. I search your live property database and turn it into fast, human-friendly answers.",
  meta: {
    intent: "AI Concierge",
    urgency: "Live",
  },
};

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function extractError(error) {
  if (error?.response?.data?.detail) {
    return typeof error.response.data.detail === "string"
      ? error.response.data.detail
      : "The assistant could not process that request.";
  }

  return "The assistant is temporarily unavailable. Please try again in a moment.";
}

export function ChatProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const openChat = () => setIsPanelOpen(true);
  const closeChat = () => setIsPanelOpen(false);

  const primePrompt = (prompt) => {
    setDraft(prompt);
    setIsPanelOpen(true);
  };

  const clearConversation = () => {
    setMessages([INITIAL_MESSAGE]);
    setDraft("");
  };

  const appendMessage = (message) => {
    setMessages((current) => [...current, message]);
  };

  const streamAssistantReply = async (messageId, content, meta) => {
    const step = Math.max(3, Math.ceil(content.length / 90));

    appendMessage({
      id: messageId,
      role: "assistant",
      content: "",
      meta,
    });

    for (let index = 0; index <= content.length; index += step) {
      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? {
                ...message,
                content: content.slice(0, index),
              }
            : message,
        ),
      );
      await delay(14);
    }

    setMessages((current) =>
      current.map((message) =>
        message.id === messageId
          ? {
              ...message,
              content,
              meta,
            }
          : message,
      ),
    );
  };

  const sendMessage = async (input = draft) => {
    const message = input.trim();

    if (!message || isThinking) {
      return { ok: false };
    }

    if (!isAuthenticated) {
      return { ok: false, reason: "auth" };
    }

    setDraft("");
    setIsPanelOpen(true);
    setIsThinking(true);

    appendMessage({
      id: generateId(),
      role: "user",
      content: message,
    });

    try {
      const result = await submitInquiry(message);
      const reply = result?.draft_response?.trim() || "I found a match, but the response came back empty.";

      await streamAssistantReply(generateId(), reply, {
        urgency: result.urgency,
        intent: result.intent,
        propertyId: result.property_id,
        appointmentDate: result.appointment_date,
      });

      return { ok: true, data: result };
    } catch (error) {
      await streamAssistantReply(generateId(), extractError(error), {
        intent: "Support",
        urgency: "System",
      });
      return { ok: false, reason: "error" };
    } finally {
      setIsThinking(false);
    }
  };

  const value = {
    messages,
    draft,
    isPanelOpen,
    isThinking,
    openChat,
    closeChat,
    setDraft,
    sendMessage,
    clearConversation,
    primePrompt,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
}
