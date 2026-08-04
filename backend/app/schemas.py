from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# --- User Schemas ---
class UserCreate(BaseModel):
    name: str
    email: str
    role: str = "patient"
    # --- NAYE FIELDS API REQUEST KE LIYE ---
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    license_number: Optional[str] = None
    specialization: Optional[str] = None
    address: Optional[str] = None
    # ---------------------------------------

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    # --- NAYE FIELDS API RESPONSE KE LIYE ---
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    
    license_number: Optional[str] = None
    specialization: Optional[str] = None
    address: Optional[str] = None
    # ----------------------------------------

    class Config:
        from_attributes = True

# --- Medical Record Schemas (Keep as it is) ---
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

    class Config:
        from_attributes = True