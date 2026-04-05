import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import SectionHeading from "../components/common/SectionHeading";
import StatCard from "../components/common/StatCard";
import { useChat } from "../context/ChatContext";
import { getUserRecords } from "../services/chatService";
import { formatDateTime } from "../utils/formatters";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { primePrompt } = useChat();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getUserRecords()
      .then((data) => {
        if (active) {
          setRecords(data);
        }
      })
      .catch(() => {
        if (active) {
          setRecords([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const openAssistant = (prompt) => {
    primePrompt(prompt);
    navigate("/assistant");
  };

  const solvedCount = records.filter((record) => record.status === "Solved").length;
  const activeCount = records.filter((record) => record.status !== "Solved").length;

  return (
    <div className="pb-10">
      <section>
        <SectionHeading
          eyebrow="Your activity"
          title="Track AI conversations and follow-up status"
          description="Every authenticated assistant conversation is recorded through the backend triage workflow, so users can revisit their requests and see what the team has done."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Total inquiries" value={records.length} detail="All saved chatbot interactions for this account." />
          <StatCard label="In progress" value={activeCount} detail="Requests still being reviewed or actioned." />
          <StatCard label="Solved" value={solvedCount} detail="Inquiries already marked resolved by the team." />
        </div>
      </section>

      <section className="mt-10">
        <div className="surface-card rounded-[2rem] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">Need another answer?</div>
              <h2 className="mt-3 font-display text-3xl text-slate-950">Jump back into the assistant</h2>
            </div>
            <button
              type="button"
              onClick={() => openAssistant("I need more property recommendations based on my last inquiry.")}
              className="pill-button bg-slate-950 text-white"
            >
              Open AI concierge
            </button>
          </div>
        </div>
      </section>

      <section className="mt-10">
        {loading ? (
          <LoadingState label="Loading inquiry history" />
        ) : records.length === 0 ? (
          <EmptyState
            title="No saved AI inquiries yet"
            description="Start chatting with the assistant and your triage records will appear here."
            action={
              <button type="button" onClick={() => openAssistant("Show me properties available this month.")} className="pill-button bg-slate-950 text-white">
                Ask the assistant
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <article key={record.id} className="surface-card rounded-[2rem] p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-4xl">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="teal">{record.intent}</Badge>
                      <Badge
                        tone={
                          record.urgency === "High"
                            ? "high"
                            : record.urgency === "Medium"
                              ? "medium"
                              : record.urgency === "Low"
                                ? "low"
                                : "neutral"
                        }
                      >
                        {record.urgency}
                      </Badge>
                      <Badge tone={record.status === "Solved" ? "success" : "accent"}>{record.status}</Badge>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-950">{record.inquiry}</h3>
                    <div className="mt-3 text-sm leading-7 text-slate-600">
                      Property reference: {record.property_id || "Not linked"} · Created {formatDateTime(record.created_at)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAssistant(record.inquiry)}
                    className="pill-button bg-white text-slate-900 ring-1 ring-slate-200"
                  >
                    Reuse prompt
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
