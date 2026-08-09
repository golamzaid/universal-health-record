from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas
from .database import engine, get_db
import random
import string

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="UPHAR API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to generate Unique UPHAR ID
def generate_uphar_id():
    return "UPH-" + "".join(random.choices(string.digits, k=6))

@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Agar user patient hai, toh uska UPHAR ID generate karo
    new_uphar_id = generate_uphar_id() if user.role == "patient" else None
        
    new_user = models.User(
        name=user.name, email=user.email, role=user.role,
        phone=user.phone, dob=user.dob, gender=user.gender,
        license_number=user.license_number, specialization=user.specialization,
        address=user.address, uphar_id=new_uphar_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

# === NAYA ROUTE: UPDATE SETTINGS ===
@app.put("/users/{user_id}/settings", response_model=schemas.UserResponse)
def update_user_settings(user_id: int, settings: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Jo fields frontend se aayenge, unko database mein update kar do
    if settings.profile_photo is not None: db_user.profile_photo = settings.profile_photo
    if settings.father_name is not None: db_user.father_name = settings.father_name
    if settings.aadhaar_number is not None: db_user.aadhaar_number = settings.aadhaar_number
    if settings.abha_number is not None: db_user.abha_number = settings.abha_number
    if settings.insurance_provider is not None: db_user.insurance_provider = settings.insurance_provider
    if settings.insurance_policy is not None: db_user.insurance_policy = settings.insurance_policy

    db.commit()
    db.refresh(db_user)
    return db_user
# ===================================

@app.post("/records/", response_model=schemas.RecordResponse)
def create_record(record: schemas.RecordCreate, db: Session = Depends(get_db)):
    new_record = models.MedicalRecord(**record.dict())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

@app.get("/users/{user_id}/records", response_model=list[schemas.RecordResponse])
def get_user_records(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.MedicalRecord).filter(models.MedicalRecord.patient_id == user_id).all()