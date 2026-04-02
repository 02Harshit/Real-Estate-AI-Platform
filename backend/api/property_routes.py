from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from db.models_db import Property, User
from services.property_service import (
    get_all_properties,
    get_property_by_id,
    create_property
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
def add_property(property_data: dict,
                 current_user: User = Depends(get_current_user),
                 db: Session = Depends(get_db)):

    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    return create_property(db, property_data)