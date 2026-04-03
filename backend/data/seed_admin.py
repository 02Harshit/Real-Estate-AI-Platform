from db.database import SessionLocal
from db.models_db import User
from api.auth_utils import get_password_hash

db = SessionLocal()

admin = User(
    name="Admin",
    phone_number="admin123",
    hashed_password=get_password_hash("1234"),
    is_admin=True
)

existing_admin = db.query(User).filter(User.phone_number=="admin123").first()

if existing_admin:
    print("Admin already exists")
else:
    db.add(admin)
    db.commit()

print("Admin user created successfully!")