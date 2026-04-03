from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import uuid
import shutil

from db.database import get_db
from db.models_db import Property, User
from services.property_service import (
    get_all_properties,
    get_property_by_id,
    create_property,
    delete_property
)

from api.auth_utils import get_current_user

router = APIRouter(prefix="/properties", tags=["Properties"])


# Get all properties (public)
@router.get("/")
def list_properties(db: Session = Depends(get_db)):
    return get_all_properties(db)


# Get single property
@router.get("/{property_id}")
def get_property(property_id: int, db: Session = Depends(get_db)):

    property_obj = get_property_by_id(db, property_id)

    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")

    return property_obj


# Create property (admin only)
@router.post("/")
def add_property(
    title: str = Form(...),
    location: str = Form(...),
    city: str = Form(...),
    price: float = Form(...),
    property_type: str = Form(...),
    bedrooms: int = Form(...),
    bathrooms: int = Form(...),
    area: str = Form(...),
    amenities: str = Form(...),
    description: str = Form(...),
    listing_type: str = Form(...),
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    filename = f"{uuid.uuid4()}_{image.filename}"
    filepath = f"uploads/{filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    property_data = {
        "title": title,
        "location": location,
        "city": city,
        "price": price,
        "property_type": property_type,
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "area": area,
        "amenities": amenities,
        "description": description,
        "listing_type": listing_type,
        "image_url": filepath
    }

    return create_property(db, property_data)

@router.delete("/{property_id}")
def delete_property_route(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    property_obj = delete_property(db, property_id)

    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")

    return {"message": "Property deleted successfully"}