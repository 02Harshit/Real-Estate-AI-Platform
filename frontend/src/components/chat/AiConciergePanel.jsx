import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import Badge from "../common/Badge";

const quickPrompts = [
  "Do you have a 3BHK apartment in Vijay Nagar?",
  "Show me premium properties under 80 lakh in Indore.",
  "I need a rental property with parking and balcony.",
  "Can I schedule a site visit this weekend?",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((item) => (
        <span
          key={item}
          className="h-2 w-2 animate-pulse rounded-full bg-slate-400"
          style={{ animationDelay: `${item * 120}ms` }}
        />
      ))}
    </div>
  );
}

function hasMetaValue(value) {
  return value !== null && value !== undefined && value !== "" && value !== "null" && value !== "None";
}

function AssistantMeta({ meta }) {
  if (!meta) {
    return null;
  }

  const urgencyTone =
    meta.urgency === "High" ? "high" : meta.urgency === "Medium" ? "medium" : meta.urgency === "Low" ? "low" : "neutral";

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {hasMetaValue(meta.intent) ? <Badge tone="teal">{meta.intent}</Badge> : null}
      {hasMetaValue(meta.urgency) ? <Badge tone={urgencyTone}>{meta.urgency}</Badge> : null}
      {hasMetaValue(meta.propertyId) ? <Badge tone="accent">Property #{meta.propertyId}</Badge> : null}
      {hasMetaValue(meta.appointmentDate) ? <Badge tone="success">{meta.appointmentDate}</Badge> : null}
    </div>
  );
}

function MessageBubble({ message }) {
  const isAssistant = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[88%] rounded-[1.6rem] px-5 py-4 ${
          isAssistant
            ? "surface-card-strong rounded-bl-md text-slate-900"
            : "rounded-br-md bg-slate-950 text-white shadow-lift"
        }`}
      >
        <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500/90">
          {isAssistant ? "AI Concierge" : "You"}
        </div>
        <div className={`mt-3 whitespace-pre-wrap text-sm leading-7 ${isAssistant ? "text-slate-700" : "text-white/90"}`}>
          {message.content ? message.content : isAssistant ? <TypingDots /> : null}
        </div>
        {isAssistant ? <AssistantMeta meta={message.meta} /> : null}
      </div>
    </motion.div>
  );
}

export default function AiConciergePanel({ compact = false }) {
  const navigate = useNavigate();
  const scrollViewportRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const {
    messages,
    draft,
    setDraft,
    sendMessage,
    isThinking,
    clearConversation,
  } = useChat();
  const hasConversationStarted = messages.some((message) => message.role === "user");

  useEffect(() => {
    const viewport = scrollViewportRef.current;

    if (!viewport) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: messages.length > 2 || isThinking ? "smooth" : "auto",
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [isThinking, messages]);

  const submitCurrentMessage = async (event) => {
    event.preventDefault();
    const result = await sendMessage();

    if (result?.reason === "auth") {
      navigate("/auth", { state: { from: { pathname: "/assistant" } } });
    }
  };

  const usePrompt = async (prompt) => {
    setDraft(prompt);

    if (!isAuthenticated) {
      navigate("/auth", { state: { from: { pathname: "/assistant" } } });
      return;
    }

    await sendMessage(prompt);
  };

  const panelShellClass = compact
    ? "h-[82vh] max-h-[920px]"
    : "min-h-[80vh] xl:h-[calc(100vh-8.5rem)]";
  const headerPaddingClass = compact ? "px-4 py-4 sm:px-5" : "px-5 py-4 sm:px-6";
  const quickPromptPaddingClass = compact ? "px-4 py-3 sm:px-5" : "px-5 py-4 sm:px-6";
  const bodyPaddingClass = compact ? "px-4 py-4 sm:px-5" : "px-5 py-5 sm:px-6";
  const footerPaddingClass = compact ? "px-4 py-4 sm:px-5" : "px-5 py-5 sm:px-6";
  const titleClass = compact ? "mt-2 text-xl font-black text-slate-950" : "mt-3 text-2xl font-black text-slate-950";
  const descriptionClass = compact
    ? "mt-2 max-w-2xl text-sm leading-6 text-slate-600"
    : "mt-2 max-w-2xl text-sm leading-7 text-slate-600";

  return (
    <div className={`surface-card-strong noise-overlay relative overflow-hidden rounded-[2rem] ${panelShellClass}`}>
      <div className="flex h-full flex-col">
        <div className={`flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 ${headerPaddingClass}`}>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="teal">RAG + CrewAI</Badge>
              <Badge tone="accent">Live property data</Badge>
            </div>
            <h2 className={titleClass}>AI real estate concierge</h2>
            <p className={descriptionClass}>
              Ask naturally about budget, location, BHK count, amenities, or next-step support. The assistant uses your
              backend triage flow and returns intelligent draft responses from real listings.
            </p>
          </div>
          <button
            type="button"
            onClick={clearConversation}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            Reset chat
          </button>
        </div>

        <AnimatePresence initial={false}>
          {!hasConversationStarted ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden border-b border-slate-200/80"
            >
              <div className={quickPromptPaddingClass}>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => usePrompt(prompt)}
                      className="rounded-full bg-slate-900/5 px-4 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-white"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div ref={scrollViewportRef} className={`flex-1 overflow-y-auto overscroll-contain ${bodyPaddingClass}`}>
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            <AnimatePresence>
              {!isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="surface-card rounded-[1.7rem] p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">Sign in to send real AI queries</div>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        The backend triage endpoint is protected by JWT auth, so we'll route you through sign-in before
                        sending live assistant messages.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link to="/auth" className="pill-button bg-slate-950 text-white">
                        Sign in
                      </Link>
                      <Link to="/properties" className="pill-button bg-white text-slate-900 ring-1 ring-slate-200">
                        Browse listings
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <form onSubmit={submitCurrentMessage} className={`border-t border-slate-200/80 ${footerPaddingClass}`}>
          <div className={`flex gap-3 ${compact ? "flex-col" : "flex-col xl:flex-row"}`}>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about locations, property types, budget, amenities, or site visits..."
              className={`input-shell resize-none ${compact ? "min-h-[84px]" : "min-h-[92px]"}`}
            />
            <button
              type="submit"
              disabled={!draft.trim() || isThinking}
              className={`pill-button bg-slate-950 text-white ${compact ? "w-full" : "min-w-[180px] self-stretch xl:self-auto"}`}
            >
              {isThinking ? "Thinking..." : "Send to AI"}
            </button>
          </div>
          <div className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Intent classification, entity extraction, vector retrieval, and draft generation in one flow
          </div>
        </form>
      </div>
    </div>
  );
}
