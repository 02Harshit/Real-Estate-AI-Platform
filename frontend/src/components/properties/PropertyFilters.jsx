export default function PropertyFilters({
  filters,
  onChange,
  cityOptions,
  propertyTypes,
  listingTypes,
}) {
  return (
    <div className="surface-card rounded-[2rem] p-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <input
          type="text"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Search by title, city, or location"
          className="input-shell"
        />

        <select
          value={filters.city}
          onChange={(event) => onChange("city", event.target.value)}
          className="input-shell"
        >
          <option value="">All cities</option>
          {cityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={filters.propertyType}
          onChange={(event) => onChange("propertyType", event.target.value)}
          className="input-shell"
        >
          <option value="">All property types</option>
          {propertyTypes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={filters.listingType}
          onChange={(event) => onChange("listingType", event.target.value)}
          className="input-shell"
        >
          <option value="">All listing modes</option>
          {listingTypes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
