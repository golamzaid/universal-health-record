# 🩺 UPHAR (Universal Patient Health Access & Record)

> **Secure. Portable. Patient-Centric.** A modern full-stack healthcare ecosystem designed to unify medical histories, streamline hospital record management, and empower patients with absolute control over their health data through temporary cryptographic consent tokens and tamper-proof audit trails.

---

## 🌟 Key Features

### 👤 For Patients
- **Unified Medical Timeline:** Aggregate all lab reports, prescriptions, consultation notes, and imaging into a single chronological timeline.
- **Granular Access Control:** Grant time-bound access (e.g., 24 hours) to doctors and revoke permissions instantly.
- **Emergency Rescue Profile:** Built-in emergency QR code system that exposes critical life-saving data (blood group, severe allergies, chronic conditions) instantly to first responders.
- **Self-Uploader Vault:** Securely upload and store past medical reports or physical prescriptions directly to your cloud timeline.

### 🩺 For Doctors
- **Secure UPHAR ID Search:** Quickly look up patient profiles using their unique health ID (`UPH-XXXXXX`).
- **Dynamic Access Requests:** Request View or Modify permissions with customizable durations (24 Hours, 7 Days, 1 Month).
- **Digital Prescriptions & Notes:** Issue verified digital prescriptions and consultation notes directly onto authorized patient timelines.

### 🏥 For Hospitals & Diagnostic Centers
- **Patient Verification Network:** Authenticate patients using their UPHAR ID before generating or pushing diagnostic reports.
- **Direct Cloud Uploads:** Compress and push verified reports (PDF, JPG, PNG, DICOM) directly into the patient's record vault.
- **Immutable Activity Logging:** Cryptographically secure audit trails that record every modification and view action.

---

## 🛠️ Tech Stack

### Frontend (`/src`)
- **Framework:** React + Vite (TypeScript)
- **Styling:** Tailwind CSS, Lucide React Icons
- **Authentication & Storage:** Supabase Auth & Storage Buckets
- **Utilities:** `html2canvas` & `jsPDF` (For generating emergency medical PDF profiles)

### Backend (`/backend`)
- **Framework:** FastAPI (Python)
- **Database ORM:** SQLAlchemy (SQLite / PostgreSQL compatible)
- **Cloud Integration:** Supabase Client for secure document management
- **CORS & Security:** Configured for high-security production environments (Vercel & Render integration)

---

## 🚀 Project Architecture & Workflow

```text
[ Patient / Hospital / Doctor ] 
         │
         ▼
[ Vercel Frontend (React + Vite) ] 
         │  (REST API / JWT Auth via Supabase)
         ▼
[ Render Backend (FastAPI Python Server) ]
         │
         ├──► [ SQLAlchemy Database (Users, Records, Consents) ]
         └──► [ Supabase Cloud Storage (Encrypted Files & Reports) ]
