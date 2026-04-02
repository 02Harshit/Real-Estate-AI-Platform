from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from pydantic import BaseModel

from db.database import get_db
from db.models_db import User
from api.auth_utils import (
    get_password_hash,
    verify_password,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(tags=["Authentication"])


class UserCreate(BaseModel):
    name: str
    phone_number: str
    password: str
    is_admin: bool = False


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # NEW: Strict 10-digit validation with admin bypass
    if "admin" not in user.phone_number.lower():
        if not user.phone_number.isdigit() or len(user.phone_number) != 10:
            raise HTTPException(status_code=400, detail="Phone number must be exactly 10 digits")

    db_user = db.query(User).filter(User.phone_number == user.phone_number).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    hashed_pwd = get_password_hash(user.password)
    # NEW: Save the user's name
    new_user = User(name=user.name, phone_number=user.phone_number, hashed_password=hashed_pwd, is_admin=user.is_admin)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone_number == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect phone number or password")
    
    access_token = create_access_token(
        data={"sub": user.phone_number, "is_admin": user.is_admin},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer", "is_admin": user.is_admin}