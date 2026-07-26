"""
FastAPI application entry point.

Start locally:
    uvicorn app.main:app --reload --port 8000

API docs:
    http://localhost:8000/docs   (Swagger UI)
    http://localhost:8000/redoc  (ReDoc)
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import Base
from app.routers import course, lessons, progress, user, leaderboard

# Create all tables on startup (Alembic is used for migrations in prod)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Duolingo Clone API",
    description="Full-stack Duolingo clone — German course, gamification, lesson player.",
    version="1.0.0",
)

# ── CORS ────────────────────────────────────────────────────────────────────
# Allow the Next.js dev server and Vercel deployment URLs
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",       # Vercel preview deployments
        "https://duolingo-clone.vercel.app",  # placeholder — update after deploy
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────────
app.include_router(course.router)
app.include_router(lessons.router)
app.include_router(progress.router)
app.include_router(user.router)
app.include_router(leaderboard.router)


@app.get("/")
def root():
    return {"message": "Duolingo Clone API 🦉", "docs": "/docs"}


@app.get("/health")
def health():
    """Health check endpoint for Render deployment."""
    return {"status": "ok"}
