from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from .database import Base

# 1. Users Table 
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(String)
    
    # --- NAYE FIELDS YAHAN ADD KIYE HAIN ---
    phone = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    
    license_number = Column(String, nullable=True)
    specialization = Column(String, nullable=True)
    address = Column(String, nullable=True)
    # ---------------------------------------

    records = relationship("MedicalRecord", back_populates="patient")

# 2. Medical Records Table (Omitted for brevity - keep it as it is)
class MedicalRecord(Base):
    __tablename__ = "medical_records"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    provider_name = Column(String)
    category = Column(String)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    
    patient = relationship("User", back_populates="records")