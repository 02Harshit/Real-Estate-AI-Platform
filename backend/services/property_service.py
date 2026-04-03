from sqlalchemy.orm import Session
from db.models_db import Property
from rag.vector_store import add_property_to_vector_store, delete_property_from_vector_store



def get_all_properties(db: Session):
    return db.query(Property).all()


def get_property_by_id(db: Session, property_id: int):
    return db.query(Property).filter(Property.id == property_id).first()


def create_property(db: Session, property_data):
    new_property = Property(**property_data)
    db.add(new_property)
    db.commit()
    db.refresh(new_property)

    add_property_to_vector_store(new_property)

    return new_property

def delete_property(db, property_id):

    property_obj = db.query(Property).filter(Property.id == property_id).first()

    if not property_obj:
        return None

    delete_property_from_vector_store(property_id)

    db.delete(property_obj)
    db.commit()

    return property_obj