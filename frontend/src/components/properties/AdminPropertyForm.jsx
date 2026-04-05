const initialValues = {
  title: "",
  location: "",
  city: "",
  price: "",
  property_type: "Apartment",
  listing_type: "Sale",
  bedrooms: "",
  bathrooms: "",
  area: "",
  amenities: "",
  description: "",
};

export function getInitialPropertyForm() {
  return { ...initialValues };
}

export default function AdminPropertyForm({
  values,
  onFieldChange,
  onFileChange,
  onSubmit,
  imageName,
  isSubmitting,
}) {
  return (
    <form onSubmit={onSubmit} className="surface-card rounded-[2rem] p-6">
      <div className="mb-6">
        <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">
          Add new inventory
        </div>
        <h3 className="mt-3 font-display text-3xl text-slate-950">Upload a live listing for the AI assistant</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Every property added here becomes browseable on the site and available to the RAG-backed assistant.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="input-shell"
          placeholder="Property title"
          value={values.title}
          onChange={(event) => onFieldChange("title", event.target.value)}
          required
        />
        <input
          className="input-shell"
          placeholder="Locality"
          value={values.location}
          onChange={(event) => onFieldChange("location", event.target.value)}
          required
        />
        <input
          className="input-shell"
          placeholder="City"
          value={values.city}
          onChange={(event) => onFieldChange("city", event.target.value)}
          required
        />
        <input
          className="input-shell"
          type="number"
          min="0"
          placeholder="Price"
          value={values.price}
          onChange={(event) => onFieldChange("price", event.target.value)}
          required
        />
        <select
          className="input-shell"
          value={values.property_type}
          onChange={(event) => onFieldChange("property_type", event.target.value)}
        >
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
          <option value="Penthouse">Penthouse</option>
        </select>
        <select
          className="input-shell"
          value={values.listing_type}
          onChange={(event) => onFieldChange("listing_type", event.target.value)}
        >
          <option value="Sale">Sale</option>
          <option value="Rent">Rent</option>
          <option value="Lease">Lease</option>
        </select>
        <input
          className="input-shell"
          type="number"
          min="0"
          placeholder="Bedrooms"
          value={values.bedrooms}
          onChange={(event) => onFieldChange("bedrooms", event.target.value)}
          required
        />
        <input
          className="input-shell"
          type="number"
          min="0"
          placeholder="Bathrooms"
          value={values.bathrooms}
          onChange={(event) => onFieldChange("bathrooms", event.target.value)}
          required
        />
        <input
          className="input-shell md:col-span-2"
          placeholder="Area, e.g. 1500 sqft"
          value={values.area}
          onChange={(event) => onFieldChange("area", event.target.value)}
          required
        />
        <textarea
          className="input-shell min-h-[120px] md:col-span-2"
          placeholder="Amenities separated by commas"
          value={values.amenities}
          onChange={(event) => onFieldChange("amenities", event.target.value)}
          required
        />
        <textarea
          className="input-shell min-h-[160px] md:col-span-2"
          placeholder="Describe the property"
          value={values.description}
          onChange={(event) => onFieldChange("description", event.target.value)}
          required
        />
      </div>

      <label className="mt-5 flex cursor-pointer flex-col gap-2 rounded-[1.4rem] border border-dashed border-slate-300 bg-white/65 p-5 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">Property image</span>
        <span>{imageName || "Choose an image to upload"}</span>
        <input type="file" accept="image/*" className="hidden" onChange={onFileChange} required />
      </label>

      <button type="submit" disabled={isSubmitting} className="pill-button mt-6 w-full bg-slate-950 text-white">
        {isSubmitting ? "Uploading listing..." : "Publish property"}
      </button>
    </form>
  );
}
