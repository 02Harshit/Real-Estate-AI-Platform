import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import { buildImageUrl, formatCurrency } from "../../utils/formatters";

function PropertyVisual({ title, imageUrl }) {
  const resolvedImage = buildImageUrl(imageUrl);

  if (resolvedImage) {
    return (
      <div className="relative h-64 overflow-hidden rounded-[1.75rem]">
        <img
          src={resolvedImage}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative flex h-64 items-end overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-teal-100 via-white to-orange-100 p-6">
      <div className="absolute inset-0 opacity-70">
        <div className="absolute -right-10 top-6 h-28 w-28 rounded-full bg-orange-300/40 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-teal-300/35 blur-2xl" />
      </div>
      <div className="relative rounded-2xl bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.28em] text-slate-700">
        Image coming soon
      </div>
    </div>
  );
}

export default function PropertyCard({ property, priority = false }) {
  return (
    <motion.article
      className="group surface-card rounded-[2rem] p-4"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Link to={`/properties/${property.id}`} className="block">
        <PropertyVisual title={property.title} imageUrl={property.image_url} />
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone="accent">{property.listing_type || "Listing"}</Badge>
          <Badge tone="teal">{property.property_type || "Property"}</Badge>
          {priority ? <Badge tone="success">Featured</Badge> : null}
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-950">{property.title}</h3>
            <p className="mt-1 text-sm text-slate-600">
              {property.location}, {property.city}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-slate-950">{formatCurrency(property.price)}</div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{property.status || "Available"}</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/70 px-4 py-3">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Beds</div>
            <div className="mt-2 text-lg font-black text-slate-900">{property.bedrooms ?? "-"}</div>
          </div>
          <div className="rounded-2xl bg-white/70 px-4 py-3">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Baths</div>
            <div className="mt-2 text-lg font-black text-slate-900">{property.bathrooms ?? "-"}</div>
          </div>
          <div className="rounded-2xl bg-white/70 px-4 py-3">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Area</div>
            <div className="mt-2 text-lg font-black text-slate-900">{property.area || "-"}</div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
