from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(String)
    
    phone = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    specialization = Column(String, nullable=True)
    address = Column(String, nullable=True)

    # === NAYE FIELDS YAHAN HAIN ===
    uphar_id = Column(String, unique=True, index=True, nullable=True) # Unique ID
    profile_photo = Column(String, nullable=True)
    father_name = Column(String, nullable=True)
    aadhaar_number = Column(String, nullable=True) # Securely stored
    abha_number = Column(String, nullable=True)    # Ayushman Bharat ID
    insurance_provider = Column(String, nullable=True)
    insurance_policy = Column(String, nullable=True)
    # ==============================

    records = relationship("MedicalRecord", back_populates="patient")

# MedicalRecord class waise hi rahegi...
class MedicalRecord(Base):
    __tablename__ = "medical_records"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    provider_name = Column(String)
    category = Column(String)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    
    patient = relationship("User", back_populates="records")
    
    # 3. Consents Table
class Consent(Base):
    __tablename__ = "consents"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("users.id"))
    
    # UI mein dikhane ke liye extra info
    doctor_name = Column(String)
    hospital_name = Column(String) 
    
    access_type = Column(String)  # 'VIEW' or 'MODIFY'
    duration = Column(String)     # '24 Hours', '7 Days', etc.
    status = Column(String, default="PENDING")  # PENDING, ACTIVE, REJECTED, REVOKED
    request_date = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships (Optional but good for SQLAlchemy)
    patient = relationship("User", foreign_keys=[patient_id])
    doctor = relationship("User", foreign_keys=[doctor_id])