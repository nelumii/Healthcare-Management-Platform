CareLink — Healthcare Management Platform

A full-stack healthcare management platform connecting **patients, doctors, pharmacies, laboratories, suppliers, and administrators** through a shared web application. CareLink combines appointment and service workflows with medical inventory, laboratory operations, administrative reporting, and an experimental AI assistance service.

## Project Purpose

CareLink aims to simplify coordination between different healthcare roles by providing one interface for appointments, prescriptions, laboratory services, pharmacy operations, supplier activities, and operational oversight.

> **Academic/portfolio project:** The AI symptom prediction and chatbot features are educational demonstrations, **not medical diagnoses or substitutes for professional care**. Do not enter real patient information into a public demo.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, Vite, React Router, Axios, Recharts |
| Backend | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA |
| Database | MySQL |
| AI Service | Python, FastAPI, scikit-learn (Random Forest), pandas, NLTK |
| Authentication | JWT-based authentication and role-based interfaces |
| Other | Maven, npm, REST APIs, email integration |

## System Modules

### 1.User and Role Management
- Registration and login flows for patients, doctors, and suppliers
- Role-aware interfaces for administrators, doctors, pharmacists, suppliers, laboratory staff, and patients
- Password recovery / OTP-related UI flows and administrative user management

### 2.Appointment & Doctor Scheduling
- Patient appointment workflows
- Doctor availability and scheduling endpoints
- Appointment status handling and notifications

### 3.Pharmacy, Prescriptions & Inventory
- Medicine and inventory records
- Prescription workflows and medication sales
- Inventory alerts, batch records, and purchasing processes

### 4.Laboratory Management
- Laboratory services and test catalog
- Laboratory scheduling slots and report-related functionality

### 5.Supplier & Purchase Orders
- Supplier and product management
- Purchase order workflows and supplier dashboard

### 6.Administration, Finance & Reports
- User administration and reporting pages
- Finance dashboard, notices, and broadcast communications

### 7.AI & Analytics (Educational)
- Symptom-based disease prediction prototype using a Random Forest model
- AI chatbot integration through an external AI service
- Feedback sentiment analysis endpoints

## Architecture

```text
React + Vite frontend (port 3000)
   | REST API (/api)
   v
Spring Boot backend (port 8081) ---- MySQL database

React AI features ---------------> FastAPI service (port 8000)
                                     |-- CSV-based model training
                                     |-- Optional Gemini chatbot
                                     +-- Feedback analytics
```

## Project Structure

```text
CareLink/
├── frontend/        # React frontend, dashboards and page components
├── backend/         # Spring Boot REST API, entities, services, security
├── ai-service/      # FastAPI service, ML workflow and training data
├── README.md
└── .gitignore
```

## Running Locally

### Prerequisites
- Node.js and npm
- JDK 17 and Maven (or the included Maven wrapper)
- MySQL server and a database named `carelink`
- Python 3.10+ recommended for the AI service

### 1. Configure the backend
Create the MySQL database and set the environment variables used in `backend/src/main/resources/application.properties`:

```bash
export CARELINK_DB_URL='jdbc:mysql://localhost:3306/carelink'
export CARELINK_DB_USER='root'
export CARELINK_DB_PASSWORD='YOUR_LOCAL_DB_PASSWORD'
export CARELINK_JWT_SECRET='YOUR_BASE64_ENCODED_JWT_SIGNING_KEY'
```

A strong Base64-encoded key is required by the JWT implementation. To generate one locally:

```bash
openssl rand -base64 48
```

Optional email functionality uses `CARELINK_MAIL_USERNAME` and `CARELINK_MAIL_PASSWORD`. See `backend/.env.example` for variable names. Spring Boot does not automatically import a `.env` file: export the variables through your shell/IDE before starting it.

```bash
cd backend
./mvnw spring-boot:run
```

On Windows use `mvnw.cmd spring-boot:run`.

**Demo role accounts** are only seeded when the corresponding optional `CARELINK_SEED_*_PASSWORD` environment variables are set. Do not enable seed accounts with weak passwords on a public deployment.

### 2. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Vite is configured to serve the frontend at `http://localhost:3000` and proxy `/api` requests to `http://localhost:8081`.

### 3. Run the optional AI service

```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

The local AI prediction prototype uses `Training.csv` to train a model at startup. Set `GEMINI_API_KEY` for the chatbot and the optional `CARELINK_AI_DB_*` / `EMAIL_*` values for the AI service's database and mail integrations. See `ai-service/.env.example`. The Python service reads **environment variables**, so export them before launch.




Project provided for demonstration and learning. Include any teammates and original dataset attribution before publishing if applicable.
