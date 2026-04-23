---
title: Real Estate AI Platform
emoji: 🏢
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
docker_file: docker/backend.Dockerfile.hf
---

# Your standard markdown text can go below this line...
# Real Estate AI Platform

A full-stack real estate platform with:

- a `React + Vite` frontend
- a `FastAPI` backend
- `PostgreSQL` via SQLAlchemy and Alembic
- an AI triage workflow powered by `CrewAI + Gemini`
- a Chroma-based vector store for property-aware retrieval

The app supports property browsing, user authentication, AI-assisted inquiry triage, a user dashboard, and admin-only property/inquiry management.

## Tech Stack

- Frontend: React 18, Vite, React Router, Axios, Framer Motion
- Backend: FastAPI, Uvicorn, SQLAlchemy, Alembic
- Database: PostgreSQL
- AI: CrewAI, Gemini 2.5 Flash
- Retrieval: Chroma + Hugging Face embeddings
- Containers: Docker, Docker Compose

## Project Structure

```text
.
|-- backend/        # FastAPI app, DB models, AI pipeline, migrations
|-- frontend/       # React + Vite client
|-- devops/         # Dockerfiles, Kubernetes, Terraform, Ansible, Jenkins
`-- docker-compose.yml
```

## Features

- Public property listing and property detail pages
- User registration and login with JWT auth
- AI concierge / inquiry triage flow
- Inquiry history for signed-in users
- Admin dashboard for recent triage records
- Admin-only property creation and deletion
- Property context retrieval using vector search

## Prerequisites

Install these before starting locally:

- Node.js 20+ and npm
- Python 3.11+
- PostgreSQL database, local or hosted
- A Gemini API key

## Environment Variables

Create `backend/.env` with:

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:5432/DB_NAME
SECRET_KEY=replace_with_a_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
```

Optional frontend env:

Create `frontend/.env` only if your frontend should call a non-default backend URL.

```env
VITE_API_BASE_URL=http://localhost:8000
```

Notes:

- `DATABASE_URL` is required. The app will fail to start without it.
- `docker-compose.yml` does not start PostgreSQL for you, so point `DATABASE_URL` at an existing database.
- Do not commit real `.env` values.

## First-Time Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Real-Estate-AI-Platform
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Make sure the upload directory exists:

```bash
mkdir uploads
```

Run database migrations:

```bash
alembic upgrade head
```

Optional seed commands:

```bash
python data/seed_admin.py
python data/seed_properties.py
```


### 3. Start the backend

From the `backend` folder:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend URLs:

- API base: `http://localhost:8000`
- Swagger docs: `http://localhost:8000/docs`

### 4. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
```

### 5. Start the frontend

```bash
npm run dev
```

Frontend URL:

- App: `http://localhost:5173`

## Docker Setup

The repo also includes Dockerfiles and Compose for the frontend and backend.

Before starting:

- ensure `backend/.env` exists
- ensure `DATABASE_URL` points to a reachable PostgreSQL instance

From the repo root:

```bash
docker compose up --build
```

Container URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

Important:

- Compose does not run Alembic automatically
- Compose does not provision PostgreSQL automatically
- if your database is empty, run migrations before using the app

## Suggested Startup Order For New Contributors

After pulling the repo, this is the safest order:

1. Create `backend/.env`
2. Create and activate the backend virtual environment
3. Install backend dependencies
4. Run `alembic upgrade head`
5. Optionally seed admin and sample properties
6. Start the backend
7. Install frontend dependencies
8. Start the frontend

## Main Routes

Frontend routes:

- `/` landing page
- `/properties` property listings
- `/properties/:propertyId` property details
- `/assistant` AI assistant page
- `/auth` register/login
- `/dashboard` authenticated user dashboard
- `/admin` admin-only dashboard

Backend endpoints:

- `POST /register`
- `POST /login`
- `POST /triage`
- `GET /properties/`
- `GET /properties/{property_id}`
- `POST /properties/` admin only
- `DELETE /properties/{property_id}` admin only
- `GET /admin/records` admin only
- `PATCH /admin/records/{record_id}/status` admin only

## How The AI Flow Works

When a user submits an inquiry:

1. the backend searches the Chroma vector store for relevant property context
2. CrewAI runs a triage pipeline
3. Gemini classifies urgency and intent, extracts structured details, and drafts a response
4. the result is stored as a triage record for dashboard/admin use

## Common Issues

### Backend fails on startup with `DATABASE_URL is missing or empty`

Your `backend/.env` is missing or not loaded correctly.

### Backend fails because `uploads` is missing

Create the `backend/uploads` folder before running Uvicorn.

### AI triage is not working

Check:

- `GEMINI_API_KEY` is set correctly
- your machine has internet access for the model call
- dependencies installed successfully, especially AI and embedding packages

### Frontend cannot reach the backend

Check:

- backend is running on port `8000`
- `VITE_API_BASE_URL` is correct if you changed it
- browser console/network tab for CORS or request errors

## DevOps Assets Included

The repo also includes:

- Dockerfiles in `devops/docker`
- Kubernetes manifests in `devops/kubernetes`
- Terraform in `devops/terraform`
- Ansible playbooks in `devops/ansible`
- Jenkins pipeline in `devops/jenkins/Jenkinsfile`

## Quick Verification Checklist

Once everything is running, verify:

- `http://localhost:5173` opens the frontend
- `http://localhost:8000/docs` opens Swagger
- you can register a user and log in
- properties load on the listing page
- the assistant works for authenticated users
- admin login can access `/admin`

## License

Add your preferred license here if the project is going to be shared publicly.
