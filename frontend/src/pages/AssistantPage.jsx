import { motion } from "framer-motion";
import AiConciergePanel from "../components/chat/AiConciergePanel";
import SectionHeading from "../components/common/SectionHeading";
import StatCard from "../components/common/StatCard";

export default function AssistantPage() {
  return (
    <div className="pb-10">
      <section className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Core product experience"
            title="The AI concierge is the main product surface"
            description="This experience mirrors the platform’s real backend flow: JWT auth, triage endpoint calls, inquiry history, and live property-aware responses."
          />
          <div className="grid gap-4">
            <StatCard label="AI stack" value="RAG + CrewAI" detail="Query understanding, retrieval, and orchestrated response drafting." />
            <StatCard label="Input style" value="Natural language" detail="Ask the way customers actually think, not the way search forms force them to type." />
            <StatCard label="Output" value="Actionable draft" detail="Intent, urgency, and response payloads from the `/triage` workflow." />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <AiConciergePanel />
        </motion.div>
      </section>
    </div>
  );
}
