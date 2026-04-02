from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from db.database import get_db
from db.models_db import TriageRecord, User
from services.triage_service import execute_triage
from api.auth_utils import get_current_user

router = APIRouter(tags=["Triage"])


class TriageRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Customer inquiry text")


@router.post("/triage")
def triage(payload: TriageRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    try:
        result = execute_triage(payload.message)
        
        new_record = TriageRecord(
            user_id=current_user.id,
            inquiry=payload.message,
            urgency=result.get("urgency", "Low"),
            intent=result.get("intent", "General Inquiry"),
            property_id=result.get("property_id"),
            appointment_date=result.get("appointment_date"),
            draft_response=result.get("draft_response", ""),
            status="Unsolved"
        )
        db.add(new_record)
        db.commit()

        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    
@router.get("/user/records")
def get_user_records(current_user: User = Depends(get_current_user),
                     db: Session = Depends(get_db)):

    records = db.query(TriageRecord)\
        .filter(TriageRecord.user_id == current_user.id)\
        .order_by(TriageRecord.created_at.desc())\
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