from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    role: str = "patient"
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    license_number: Optional[str] = None
    specialization: Optional[str] = None
    address: Optional[str] = None

# New schema for updating from Settings page
class UserUpdate(BaseModel):
    profile_photo: Optional[str] = None
    father_name: Optional[str] = None
    aadhaar_number: Optional[str] = None
    abha_number: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_policy: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    license_number: Optional[str] = None
    specialization: Optional[str] = None
    address: Optional[str] = None
    
    # Include new fields in response as well
    uphar_id: Optional[str] = None
    profile_photo: Optional[str] = None
    father_name: Optional[str] = None
    aadhaar_number: Optional[str] = None
    abha_number: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_policy: Optional[str] = None

    class Config:
        from_attributes = True

# RecordCreate and RecordResponse remain the same...
class RecordCreate(BaseModel):
    patient_id: int
    title: str
    provider_name: str
    category: str

class RecordResponse(BaseModel):
    id: int
    patient_id: int
    title: str
    provider_name: str
    category: str
    date: datetime
    file_url: Optional[str] = None 
    class Config:
        from_attributes = True
        
# --- Consent Schemas  ---
class ConsentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    doctor_name: str
    hospital_name: str
    access_type: str
    duration: str

class ConsentUpdate(BaseModel):
    status: str  # For APPROVE, REJECT, REVOKE actions

class ConsentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    doctor_name: str
    hospital_name: str
    access_type: str
    duration: str
    status: str
    request_date: datetime

    class Config:
        from_attributes = True