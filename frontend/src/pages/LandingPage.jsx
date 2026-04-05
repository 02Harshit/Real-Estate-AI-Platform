import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionHeading from "../components/common/SectionHeading";
import StatCard from "../components/common/StatCard";
import PropertyCard from "../components/properties/PropertyCard";
import { useChat } from "../context/ChatContext";
import { getProperties } from "../services/propertyService";

const featureCards = [
  {
    title: "AI-powered property assistant",
    description: "Natural-language search backed by RAG, intent detection, and listing-aware responses.",
  },
  {
    title: "Smart recommendations",
    description: "Turn broad needs into tailored matches using bedrooms, budget, location, and amenities.",
  },
  {
    title: "Instant support flow",
    description: "Qualify leads, identify urgency, and draft clear next-step responses in seconds.",
  },
  {
    title: "Real listings, not mock data",
    description: "The assistant speaks from the same live inventory customers can browse on the platform.",
  },
];

const assistantPrompts = [
  "Find me a 3BHK apartment in Vijay Nagar",
  "Show luxury properties in Indore with parking",
  "Suggest a family home under 1 crore",
  "I want to book a site visit",
];

const trustMetrics = [
  { label: "Live property context", value: "RAG ready", detail: "Answers grounded in indexed listings and metadata." },
  { label: "AI response speed", value: "< 1 min", detail: "Fast qualification for common property questions." },
  { label: "Support coverage", value: "24/7", detail: "Instant first response before the team steps in." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { primePrompt } = useChat();
  const [featuredProperties, setFeaturedProperties] = useState([]);

  useEffect(() => {
    let active = true;

    getProperties()
      .then((data) => {
        if (active) {
          setFeaturedProperties(data.slice(0, 3));
        }
      })
      .catch(() => {
        if (active) {
          setFeaturedProperties([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const launchAssistant = (prompt) => {
    primePrompt(prompt);
    navigate("/assistant");
  };

  return (
    <div className="pb-8">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-3 rounded-full bg-white/75 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.26em] text-slate-600 ring-1 ring-slate-900/8">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            AI-first real estate platform
          </div>

          <div className="space-y-6">
            <h1 className="font-display text-balance text-5xl leading-[1.02] text-slate-950 sm:text-6xl lg:text-7xl">
              Find your dream home with <span className="text-gradient">AI assistance</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Browse premium listings and talk to an AI concierge that understands neighborhoods, budgets, BHK needs,
              and next-step support. The assistant is the front door to your property search.
            </p>
          </div>

          <div className="surface-card hero-glow rounded-[2rem] p-5 sm:p-6">
            <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">Start with a smart prompt</div>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => launchAssistant("Do you have a 3BHK apartment in Vijay Nagar?")}
                className="pill-button flex-1 bg-slate-950 text-white"
              >
                Launch AI assistant
              </button>
              <Link to="/properties" className="pill-button flex-1 bg-white text-slate-900 ring-1 ring-slate-200">
                Browse listings
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {assistantPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => launchAssistant(prompt)}
                  className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-950 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {trustMetrics.map((metric) => (
              <StatCard key={metric.label} {...metric} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
          className="surface-card hero-glow rounded-[2.4rem] p-5 sm:p-6"
        >
          <div className="flex items-center justify-between rounded-[1.8rem] bg-slate-950 px-5 py-4 text-white">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-white/70">Haven AI concierge</div>
              <div className="mt-2 text-2xl font-black">Smart search in motion</div>
            </div>
            <div className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em]">Live</div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-[1.7rem] bg-white/90 p-5">
              <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">User</div>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Do you have a 3BHK apartment in Vijay Nagar with parking and good natural light?
              </p>
            </div>
            <div className="rounded-[1.7rem] bg-slate-950 p-5 text-white">
              <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-white/60">AI reply</div>
              <p className="mt-3 text-sm leading-7 text-white/85">
                Yes. I found live apartment listings in Vijay Nagar that match 3BHK needs, plus parking and family-friendly
                amenities. I can also narrow by budget or schedule a visit.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">Intent</div>
                  <div className="mt-2 text-sm font-bold">Buying</div>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">Urgency</div>
                  <div className="mt-2 text-sm font-bold">Medium</div>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">Source</div>
                  <div className="mt-2 text-sm font-bold">RAG listings</div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.6rem] bg-white/75 p-5">
                <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">AI workflow</div>
                <div className="mt-3 text-sm leading-7 text-slate-700">
                  Query understanding, vector search, CrewAI orchestration, and automated draft generation.
                </div>
              </div>
              <div className="rounded-[1.6rem] bg-white/75 p-5">
                <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">Conversion edge</div>
                <div className="mt-3 text-sm leading-7 text-slate-700">
                  Turn top-of-funnel curiosity into qualified lead records and actionable admin follow-up.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mt-20">
        <SectionHeading
          eyebrow="Why it feels different"
          title="The website is designed around the AI assistant, not just around listings."
          description="Every major surface reinforces the same idea: customers can browse properties, but they can also ask better questions and get sharper answers instantly."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="surface-card rounded-[1.8rem] p-6"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.42, delay: index * 0.05, ease: "easeOut" }}
            >
              <div className="text-sm font-extrabold uppercase tracking-[0.24em] text-orange-600">0{index + 1}</div>
              <h3 className="mt-4 text-xl font-bold text-slate-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Featured inventory"
            title="Real listings the assistant can talk about right now"
            description="The chatbot and the property catalog share the same live property data, so discovery and conversation stay aligned."
          />
          <Link to="/properties" className="pill-button bg-slate-950 text-white">
            View all properties
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {featuredProperties.length > 0 ? (
            featuredProperties.map((property) => <PropertyCard key={property.id} property={property} priority />)
          ) : (
            <div className="surface-card rounded-[2rem] p-8 text-sm leading-7 text-slate-600 lg:col-span-3">
              Featured listings will appear here once the backend returns property data.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
