import { useDeferredValue, useEffect, useState } from "react";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import SectionHeading from "../components/common/SectionHeading";
import StatCard from "../components/common/StatCard";
import PropertyCard from "../components/properties/PropertyCard";
import PropertyFilters from "../components/properties/PropertyFilters";
import { getProperties } from "../services/propertyService";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    propertyType: "",
    listingType: "",
  });

  const deferredSearch = useDeferredValue(filters.search);

  useEffect(() => {
    let active = true;

    setLoading(true);
    getProperties()
      .then((data) => {
        if (active) {
          setProperties(data);
        }
      })
      .catch(() => {
        if (active) {
          setProperties([]);
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

  const filteredProperties = properties.filter((property) => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      [property.title, property.location, property.city, property.property_type]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));

    const matchesCity = !filters.city || property.city === filters.city;
    const matchesPropertyType = !filters.propertyType || property.property_type === filters.propertyType;
    const matchesListingType = !filters.listingType || property.listing_type === filters.listingType;

    return matchesSearch && matchesCity && matchesPropertyType && matchesListingType;
  });

  const cityOptions = [...new Set(properties.map((property) => property.city).filter(Boolean))];
  const propertyTypes = [...new Set(properties.map((property) => property.property_type).filter(Boolean))];
  const listingTypes = [...new Set(properties.map((property) => property.listing_type).filter(Boolean))];

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="pb-10">
      <section>
        <SectionHeading
          eyebrow="Property catalog"
          title="Browse live real estate inventory with AI-ready context"
          description="Search by city, locality, or property type, then jump into the AI assistant whenever you want richer, more conversational guidance."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Live listings" value={properties.length} detail="Pulled from the FastAPI property endpoints." />
          <StatCard label="Search behavior" value="Natural" detail="Filter manually or continue discovery with the assistant." />
          <StatCard label="Responsive view" value="Mobile ready" detail="Cards, detail views, and chat all adapt across devices." />
        </div>
      </section>

      <section className="mt-10">
        <PropertyFilters
          filters={filters}
          onChange={handleFilterChange}
          cityOptions={cityOptions}
          propertyTypes={propertyTypes}
          listingTypes={listingTypes}
        />
      </section>

      <section className="mt-10">
        {loading ? (
          <LoadingState label="Loading properties" />
        ) : filteredProperties.length === 0 ? (
          <EmptyState
            title="No properties match those filters"
            description="Try widening the city or property filters, or ask the AI assistant for a more conversational search."
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
