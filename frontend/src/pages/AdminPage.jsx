import { useEffect, useState } from "react";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import SectionHeading from "../components/common/SectionHeading";
import StatCard from "../components/common/StatCard";
import AdminPropertyForm, { getInitialPropertyForm } from "../components/properties/AdminPropertyForm";
import { deleteProperty, getProperties, createProperty } from "../services/propertyService";
import { getAdminRecords, updateInquiryStatus } from "../services/adminService";
import { buildImageUrl, formatCurrency } from "../utils/formatters";

function toneForUrgency(urgency) {
  if (urgency === "High") {
    return "high";
  }

  if (urgency === "Medium") {
    return "medium";
  }

  if (urgency === "Low") {
    return "low";
  }

  return "neutral";
}

export default function AdminPage() {
  const [records, setRecords] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState(getInitialPropertyForm());
  const [selectedImage, setSelectedImage] = useState(null);
  const [submitState, setSubmitState] = useState({ saving: false, message: "", tone: "neutral" });

  const loadData = async () => {
    setLoading(true);

    try {
      const [recordsData, propertiesData] = await Promise.all([getAdminRecords(), getProperties()]);
      setRecords(recordsData);
      setProperties(propertiesData);
    } catch {
      setRecords([]);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateField = (field, value) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleStatusChange = async (recordId, status) => {
    const previousRecords = records;
    setRecords((current) => current.map((record) => (record.id === recordId ? { ...record, status } : record)));

    try {
      await updateInquiryStatus(recordId, status);
    } catch {
      setRecords(previousRecords);
      setSubmitState({
        saving: false,
        message: "Unable to update inquiry status right now.",
        tone: "error",
      });
    }
  };

  const handlePropertySubmit = async (event) => {
    event.preventDefault();

    if (!selectedImage) {
      setSubmitState({ saving: false, message: "Please choose an image before publishing.", tone: "error" });
      return;
    }

    setSubmitState({ saving: true, message: "", tone: "neutral" });

    try {
      const payload = new FormData();
      Object.entries(formValues).forEach(([key, value]) => payload.append(key, value));
      payload.append("image", selectedImage);

      await createProperty(payload);
      setFormValues(getInitialPropertyForm());
      setSelectedImage(null);
      setSubmitState({ saving: false, message: "Property published successfully.", tone: "success" });
      await loadData();
    } catch {
      setSubmitState({ saving: false, message: "Property upload failed. Please try again.", tone: "error" });
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    const shouldDelete = window.confirm("Delete this property from the platform and vector index?");

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteProperty(propertyId);
      setProperties((current) => current.filter((property) => property.id !== propertyId));
    } catch {
      setSubmitState({ saving: false, message: "Unable to delete that property.", tone: "error" });
    }
  };

  const unsolvedCount = records.filter((record) => record.status === "Unsolved").length;
  const solvedCount = records.filter((record) => record.status === "Solved").length;

  return (
    <div className="pb-10">
      <section>
        <SectionHeading
          eyebrow="Admin workspace"
          title="Operate the AI pipeline, support queue, and property inventory from one dashboard"
          description="Admins can review triage outcomes, mark inquiry status, and publish new properties that instantly strengthen the assistant’s knowledge base."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Open inquiries" value={unsolvedCount} detail="Customer requests still awaiting action." />
          <StatCard label="Resolved" value={solvedCount} detail="Requests already completed by the team." />
          <StatCard label="Tracked records" value={records.length} detail="Latest triage history from `/admin/records`." />
          <StatCard label="Property inventory" value={properties.length} detail="Listings powering the catalog and AI retrieval." />
        </div>
      </section>

      {submitState.message ? (
        <div
          className={`mt-8 rounded-[1.4rem] px-5 py-4 text-sm font-semibold ${
            submitState.tone === "success" ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"
          }`}
        >
          {submitState.message}
        </div>
      ) : null}

      <section className="mt-10 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {loading ? (
            <LoadingState label="Loading admin records" />
          ) : records.length === 0 ? (
            <EmptyState
              title="No inquiry records yet"
              description="As customers use the AI assistant, triage records will appear here for your team to manage."
            />
          ) : (
            records.map((record) => (
              <article key={record.id} className="surface-card rounded-[2rem] p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={toneForUrgency(record.urgency)}>{record.urgency}</Badge>
                      <Badge tone="teal">{record.intent}</Badge>
                      <Badge tone={record.status === "Solved" ? "success" : "accent"}>{record.status}</Badge>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                      Customer #{record.id}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{record.name || "Unknown user"}</h3>
                    <div className="mt-1 text-sm text-slate-600">{record.phone_number}</div>
                  </div>

                  <p className="text-sm leading-7 text-slate-700">{record.inquiry}</p>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-semibold text-slate-600">
                      Property reference: {record.property_id || "Not linked"}
                    </div>
                    <select
                      value={record.status}
                      onChange={(event) => handleStatusChange(record.id, event.target.value)}
                      className="input-shell max-w-[220px]"
                    >
                      <option value="Unsolved">Unsolved</option>
                      <option value="Action Taken">Action Taken</option>
                      <option value="Solved">Solved</option>
                    </select>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div>
          <AdminPropertyForm
            values={formValues}
            onFieldChange={updateField}
            onFileChange={(event) => setSelectedImage(event.target.files?.[0] || null)}
            onSubmit={handlePropertySubmit}
            imageName={selectedImage?.name}
            isSubmitting={submitState.saving}
          />
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">Inventory overview</div>
            <h2 className="font-display mt-3 text-4xl text-slate-950">Current property library</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {properties.map((property) => {
            const propertyImage = buildImageUrl(property.image_url);

            return (
              <div key={property.id} className="surface-card rounded-[2rem] p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="h-36 w-full overflow-hidden rounded-[1.5rem] bg-slate-100 sm:w-48">
                    {propertyImage ? (
                      <img src={propertyImage} alt={property.title} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <Badge tone="accent">{property.listing_type}</Badge>
                        <Badge tone="teal">{property.property_type}</Badge>
                      </div>
                      <h3 className="mt-3 text-xl font-bold text-slate-950">{property.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        {property.location}, {property.city}
                      </p>
                      <p className="mt-3 text-sm font-semibold text-slate-800">{formatCurrency(property.price)}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleDeleteProperty(property.id)}
                        className="pill-button bg-rose-600 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
