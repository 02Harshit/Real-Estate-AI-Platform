from sqlalchemy.orm import Session
from db.models_db import Property


def get_all_properties(db: Session):
    return db.query(Property).all()


def get_property_by_id(db: Session, property_id: int):
    return db.query(Property).filter(Property.id == property_id).first()


def create_property(db: Session, property_data):
    new_property = Property(**property_data)
    db.add(new_property)
    db.commit()
    db.refresh(new_property)
    return new_property