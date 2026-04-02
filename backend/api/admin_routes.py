from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import case
from pydantic import BaseModel
from typing import Literal

from db.database import get_db
from db.models_db import TriageRecord, User
from api.auth_utils import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])


class StatusUpdate(BaseModel):
    status: Literal["Unsolved", "Action Taken", "Solved"]


@router.get("/records")
def get_admin_records(current_user: User = Depends(get_current_user),
                      db: Session = Depends(get_db)):

    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    urgency_order = case(
        (TriageRecord.urgency == 'High', 1),
        (TriageRecord.urgency == 'Medium', 2),
        (TriageRecord.urgency == 'Low', 3),
        else_=4
    )

    results = db.query(TriageRecord, User.phone_number, User.name) \
        .join(User, TriageRecord.user_id == User.id) \
        .order_by(urgency_order, TriageRecord.created_at.desc()) \
        .limit(15).all()

    formatted_records = []

    for record, phone, name in results:
        formatted_records.append({
            "id": record.id,
            "name": name,
            "phone_number": phone,
            "urgency": record.urgency,
            "intent": record.intent,
            "inquiry": record.inquiry,
            "property_id": record.property_id,
            "status": record.status
        })

    return formatted_records


@router.patch("/records/{record_id}/status")
def update_record_status(record_id: int,
                         payload: StatusUpdate,
                         current_user: User = Depends(get_current_user),
                         db: Session = Depends(get_db)):

    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    record = db.query(TriageRecord).filter(TriageRecord.id == record_id).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    record.status = payload.status
    db.commit()

    return {
        "message": "Status updated successfully",
        "status": record.status
    }


@router.get("/user/records")
def get_user_records(current_user: User = Depends(get_current_user),
                     db: Session = Depends(get_db)):

    records = db.query(TriageRecord) \
        .filter(TriageRecord.user_id == current_user.id) \
        .order_by(TriageRecord.created_at.desc()) \
        .all()

    formatted_records = []

    for r in records:
        formatted_records.append({
            "id": r.id,
            "urgency": r.urgency,
            "intent": r.intent,
            "inquiry": r.inquiry,
            "property_id": r.property_id,
            "status": r.status,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M") if r.created_at else "N/A"
        })

    return formatted_records