from db.database import SessionLocal
from db.models_db import Property

db = SessionLocal()

properties = [
    Property(
        title="Luxury Apartment",
        location="Vijay Nagar Indore",
        price=6500000,
        property_type="Apartment",
        bedrooms=3,
        area="1500 sqft",
        amenities="Gym, Parking, Security",
        description="Luxury apartment near malls",
        image_url=""
    ),
    Property(
        title="Budget 2BHK",
        location="Bengali Square Indore",
        price=3500000,
        property_type="Apartment",
        bedrooms=2,
        area="1000 sqft",
        amenities="Parking, Security",
        description="Affordable housing option",
        image_url=""
    ),
]

for prop in properties:
    db.add(prop)

db.commit()

print("Properties seeded successfully!")

if __name__ == "__main__":
    print("Seeding properties...")