import os
import uuid
import random
import string
from fastapi import File, UploadFile, Form
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from supabase import create_client, Client
from . import models, schemas
from .database import engine, get_db

# Initialize database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="UPHAR API")

# Setup Supabase Client for Cloud Storage
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize the Supabase client only if credentials are provided
if SUPABASE_URL and SUPABASE_KEY:
    supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    print("Warning: Supabase credentials are missing from the environment variables.")

# Configure CORS for frontend communication (Localhost and Production Domains)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "https://universal-health-record.vercel.app"
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Utility function to generate a unique UPHAR Health ID
def generate_uphar_id():
    return "UPH-" + "".join(random.choices(string.digits, k=6))

# ==========================================
# USER MANAGEMENT ROUTES
# ==========================================

@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Verify if the email is already registered
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Generate a unique UPHAR ID exclusively for patient accounts
    new_uphar_id = generate_uphar_id() if user.role == "patient" else None
        
    # Construct the new user record
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
    # Retrieve all users from the database
    return db.query(models.User).all()

@app.put("/users/{user_id}/settings", response_model=schemas.UserResponse)
def update_user_settings(user_id: int, settings: schemas.UserUpdate, db: Session = Depends(get_db)):
    # Retrieve the user record to update
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update database record with the provided settings
    if settings.profile_photo is not None: db_user.profile_photo = settings.profile_photo
    if settings.father_name is not None: db_user.father_name = settings.father_name
    if settings.aadhaar_number is not None: db_user.aadhaar_number = settings.aadhaar_number
    if settings.abha_number is not None: db_user.abha_number = settings.abha_number
    if settings.insurance_provider is not None: db_user.insurance_provider = settings.insurance_provider
    if settings.insurance_policy is not None: db_user.insurance_policy = settings.insurance_policy

    db.commit()
    db.refresh(db_user)
    return db_user

# ==========================================
# MEDICAL RECORDS & CLOUD STORAGE ROUTES
# ==========================================

@app.post("/records/", response_model=schemas.RecordResponse)
async def create_record(
    patient_id: int = Form(...),
    title: str = Form(...),
    category: str = Form(...),
    provider_name: str = Form(...),
    date: str = Form(...),
    file: UploadFile = File(None), # Document upload is optional
    db: Session = Depends(get_db)
):
    file_url = None
    
    # Process and upload the file to Supabase Cloud Storage if provided
    if file:
        try:
            # Generate a secure, randomized filename to prevent overwrites
            file_extension = file.filename.split(".")[-1]
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            
            # Read the file data asynchronously
            file_bytes = await file.read()
            
            # Upload the byte stream to the 'records' bucket in Supabase
            supabase_client.storage.from_("records").upload(
                path=unique_filename,
                file=file_bytes,
                file_options={"content-type": file.content_type}
            )
            
            # Retrieve the persistent public URL for the uploaded document
            file_url = supabase_client.storage.from_("records").get_public_url(unique_filename)
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Cloud storage upload failed: {str(e)}")

    # Construct the medical record entry with the corresponding cloud URL
    new_record = models.MedicalRecord(
        patient_id=patient_id,
        title=title,
        category=category,
        provider_name=provider_name,
        date=date,
        file_url=file_url
    )
    
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

@app.get("/users/{user_id}/records", response_model=list[schemas.RecordResponse])
def get_user_records(user_id: int, db: Session = Depends(get_db)):
    # Retrieve all medical records associated with a specific patient
    return db.query(models.MedicalRecord).filter(models.MedicalRecord.patient_id == user_id).all()

# ==========================================
# CONSENT & AUTHORIZATION MANAGEMENT ROUTES
# ==========================================

@app.post("/consents/", response_model=schemas.ConsentResponse)
def create_consent_request(consent: schemas.ConsentCreate, db: Session = Depends(get_db)):
    # Initialize a new consent request from a provider to a patient
    new_consent = models.Consent(**consent.dict())
    db.add(new_consent)
    db.commit()
    db.refresh(new_consent)
    return new_consent

@app.get("/users/{user_id}/consents", response_model=list[schemas.ConsentResponse])
def get_patient_consents(user_id: int, db: Session = Depends(get_db)):
    # Fetch all incoming access requests for a patient dashboard
    return db.query(models.Consent).filter(models.Consent.patient_id == user_id).all()

@app.put("/consents/{consent_id}", response_model=schemas.ConsentResponse)
def update_consent_status(consent_id: int, status_update: schemas.ConsentUpdate, db: Session = Depends(get_db)):
    # Process patient actions (Approve, Reject, or Revoke) on a consent request
    db_consent = db.query(models.Consent).filter(models.Consent.id == consent_id).first()
    if not db_consent:
        raise HTTPException(status_code=404, detail="Consent request not found")

    db_consent.status = status_update.status
    db.commit()
    db.refresh(db_consent)
    return db_consent

@app.get("/doctors/{doctor_id}/consents", response_model=list[schemas.ConsentResponse])
def get_doctor_consents(doctor_id: int, db: Session = Depends(get_db)):
    # Fetch all authorized patients for a provider's active directory
    return db.query(models.Consent).filter(models.Consent.doctor_id == doctor_id).all()