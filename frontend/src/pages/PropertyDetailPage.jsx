import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import PropertyCard from "../components/properties/PropertyCard";
import { useChat } from "../context/ChatContext";
import { getProperties, getPropertyById } from "../services/propertyService";
import { buildImageUrl, formatCurrency, splitAmenities } from "../utils/formatters";

export default function PropertyDetailPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { primePrompt } = useChat();
  const [property, setProperty] = useState(null);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setLoading(true);
    Promise.all([getPropertyById(propertyId), getProperties()])
      .then(([currentProperty, allProperties]) => {
        if (!active) {
          return;
        }

        setProperty(currentProperty);
        setRelatedProperties(
          allProperties
            .filter((item) => item.id !== currentProperty.id && item.city === currentProperty.city)
            .slice(0, 3),
        );
      })
      .catch(() => {
        if (active) {
          setProperty(null);
          setRelatedProperties([]);
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
  }, [propertyId]);

  if (loading) {
    return <LoadingState label="Loading property details" />;
  }

  if (!property) {
    return (
      <EmptyState
        title="Property not found"
        description="This listing could not be loaded. The property may have been removed or the backend may be unavailable."
        action={
          <Link to="/properties" className="pill-button bg-slate-950 text-white">
            Back to properties
          </Link>
        }
      />
    );
  }

  const resolvedImage = buildImageUrl(property.image_url);
  const amenities = splitAmenities(property.amenities);

  const askAssistant = () => {
    primePrompt(
      `Tell me more about ${property.title} in ${property.location}, ${property.city}. Include price, amenities, and whether it seems right for a family.`,
    );
    navigate("/assistant");
  };

  return (
    <div className="pb-10">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="surface-card overflow-hidden rounded-[2.4rem] p-4"
        >
          {resolvedImage ? (
            <img src={resolvedImage} alt={property.title} className="h-full min-h-[420px] w-full rounded-[2rem] object-cover" />
          ) : (
            <div className="flex min-h-[420px] items-end rounded-[2rem] bg-gradient-to-br from-teal-100 via-white to-orange-100 p-8">
              <div className="rounded-full bg-white/90 px-5 py-3 text-xs font-extrabold uppercase tracking-[0.28em] text-slate-700">
                Image unavailable
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          className="surface-card rounded-[2.4rem] p-6 sm:p-8"
        >
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">{property.listing_type || "Listing"}</Badge>
            <Badge tone="teal">{property.property_type || "Property"}</Badge>
            <Badge tone="success">{property.status || "Available"}</Badge>
          </div>

          <h1 className="font-display mt-5 text-4xl leading-tight text-slate-950 sm:text-5xl">{property.title}</h1>
          <p className="mt-3 text-lg text-slate-600">
            {property.location}, {property.city}
          </p>

          <div className="mt-6 text-4xl font-black text-slate-950">{formatCurrency(property.price)}</div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.6rem] bg-white/80 p-5">
              <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">Bedrooms</div>
              <div className="mt-2 text-2xl font-black text-slate-950">{property.bedrooms}</div>
            </div>
            <div className="rounded-[1.6rem] bg-white/80 p-5">
              <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">Bathrooms</div>
              <div className="mt-2 text-2xl font-black text-slate-950">{property.bathrooms}</div>
            </div>
            <div className="rounded-[1.6rem] bg-white/80 p-5">
              <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">Area</div>
              <div className="mt-2 text-2xl font-black text-slate-950">{property.area}</div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={askAssistant} className="pill-button flex-1 bg-slate-950 text-white">
              Ask AI about this property
            </button>
            <Link to="/properties" className="pill-button flex-1 bg-white text-slate-900 ring-1 ring-slate-200">
              Explore more listings
            </Link>
          </div>

          <div className="mt-10">
            <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">Overview</div>
            <p className="mt-3 text-sm leading-8 text-slate-700">{property.description || "No description available."}</p>
          </div>
        </motion.div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface-card rounded-[2rem] p-6">
          <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">Amenities</div>
          <div className="mt-4 flex flex-wrap gap-3">
            {amenities.length > 0 ? (
              amenities.map((amenity) => (
                <span key={amenity} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                  {amenity}
                </span>
              ))
            ) : (
              <div className="text-sm text-slate-600">No amenities listed for this property.</div>
            )}
          </div>
        </div>

        <div className="surface-card rounded-[2rem] p-6">
          <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">Why use the AI here?</div>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
            <p>The assistant can summarize fit, compare similar listings, and respond to natural questions about this property.</p>
            <p>Ask follow-ups like “Is this good for a family?” or “Show me similar options nearby under the same budget.”</p>
          </div>
        </div>
      </section>

      {relatedProperties.length > 0 ? (
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">Related listings</div>
              <h2 className="font-display mt-3 text-4xl text-slate-950">More in {property.city}</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {relatedProperties.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
