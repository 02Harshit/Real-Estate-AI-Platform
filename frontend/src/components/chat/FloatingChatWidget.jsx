import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import AiConciergePanel from "./AiConciergePanel";

export default function FloatingChatWidget() {
  const location = useLocation();
  const { isPanelOpen, openChat, closeChat } = useChat();

  if (location.pathname === "/assistant") {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isPanelOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close AI assistant"
              className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeChat}
            />
            <motion.div
              className="fixed bottom-24 right-4 z-50 h-[82vh] max-h-[920px] w-[min(96vw,28rem)] sm:right-6"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              <AiConciergePanel compact />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={openChat}
        className="fixed bottom-6 right-4 z-50 flex items-center gap-3 rounded-full bg-slate-950 px-5 py-4 text-sm font-bold text-white shadow-[0_18px_40px_rgba(15,23,42,0.28)] sm:right-6"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xs uppercase tracking-[0.28em]">
          AI
        </span>
        <span>Ask Haven AI</span>
      </motion.button>
    </>
  );
}
