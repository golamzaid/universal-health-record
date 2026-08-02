from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas
from .database import engine, get_db

# Automatically create database tables if they don't exist
models.Base.metadata.create_all(bind=engine)

# Initialize the FastAPI app
app = FastAPI(
    title="Universal Health Record API",
    description="Backend API for UPHRP System",
    version="1.0.0"
)

# Allow React Frontend to connect to FastAPI Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "UPHRP Backend API is running!"}

# --- ROUTE 1: CREATE USER ---
@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check karo ki kya email pehle se registered hai
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Naya user database mein dalo
    new_user = models.User(name=user.name, email=user.email, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

# ==========================================
# NAYE ROUTES YAHAN SE SHURU HOTE HAIN
# ==========================================

# --- NAYA ROUTE 2: GET ALL USERS ---
@app.get("/users/", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

# --- NAYA ROUTE 3: CREATE MEDICAL RECORD ---
@app.post("/records/", response_model=schemas.RecordResponse)
def create_record(record: schemas.RecordCreate, db: Session = Depends(get_db)):
    new_record = models.MedicalRecord(
        patient_id=record.patient_id,
        title=record.title,
        provider_name=record.provider_name,
        category=record.category
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

# --- NAYA ROUTE 4: GET RECORDS BY PATIENT ID ---
@app.get("/users/{user_id}/records", response_model=list[schemas.RecordResponse])
def get_user_records(user_id: int, db: Session = Depends(get_db)):
    records = db.query(models.MedicalRecord).filter(models.MedicalRecord.patient_id == user_id).all()
    return records