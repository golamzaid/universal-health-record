from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# --- User Schemas ---
class UserCreate(BaseModel):
    name: str
    email: str
    role: str = "patient"

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True

# --- Medical Record Schemas (NEW) ---
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