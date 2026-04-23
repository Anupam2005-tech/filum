import firebase_admin
import json
from firebase_admin import credentials, firestore
import os
from pathlib import Path
from dotenv import load_dotenv

# Try to find .env in current or parent directories
env_path = Path(".") / ".env"
if not env_path.exists():
    env_path = Path("..") / ".env"

load_dotenv(dotenv_path=env_path)


class Database:
    def __init__(self):
        self.db = None
        self._initialize_firebase()

    def _initialize_firebase(self):
        try:
            if not firebase_admin._apps:
                service_account_data = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

                if service_account_data:
                    # Check if it's a file path
                    if os.path.exists(service_account_data):
                        cred = credentials.Certificate(service_account_data)
                        firebase_admin.initialize_app(cred)
                    else:
                        # Try parsing as JSON string
                        try:
                            cert_info = json.loads(service_account_data)
                            cred = credentials.Certificate(cert_info)
                            firebase_admin.initialize_app(cred)
                        except json.JSONDecodeError:
                            print(
                                "FIREBASE_SERVICE_ACCOUNT_JSON is neither a file path nor valid JSON."
                            )
                            firebase_admin.initialize_app()
                        except Exception as e:
                            print(f"Error with credentials: {e}")
                            firebase_admin.initialize_app()
                else:
                    firebase_admin.initialize_app()

            self.db = firestore.client(database_id="filum")
            print("Firebase Database initialized successfully.")
        except Exception as e:
            print(f"Error initializing Firebase: {e}")

    # --- User & Profile Management ---
    async def get_user_profile(self, user_id: str):
        doc = self.db.collection("users").document(user_id).get()
        return doc.to_dict() if doc.exists else None

    async def update_user_profile(self, user_id: str, data: dict):
        self.db.collection("users").document(user_id).set(data, merge=True)
        return True

    async def delete_user_profile(self, user_id: str):
        self.db.collection("users").document(user_id).delete()
        return True

    # --- Resumes ---
    async def save_resume(self, user_id: str, resume_data: dict):
        doc_ref = (
            self.db.collection("users")
            .document(user_id)
            .collection("resumes")
            .document()
        )
        doc_ref.set(resume_data)
        return doc_ref.id

    async def get_latest_resume(self, user_id: str):
        docs = (
            self.db.collection("users")
            .document(user_id)
            .collection("resumes")
            .order_by("timestamp", direction=firestore.Query.DESCENDING)
            .limit(1)
            .stream()
        )
        for doc in docs:
            return doc.to_dict()
        return None

    # --- Jobs ---
    async def save_jobs(self, user_id: str, jobs: list):
        batch = self.db.batch()
        for job in jobs:
            doc_ref = (
                self.db.collection("users")
                .document(user_id)
                .collection("jobs")
                .document()
            )
            batch.set(doc_ref, {**job, "applied": False})
        batch.commit()
        return True

    async def get_saved_jobs(self, user_id: str):
        docs = self.db.collection("users").document(user_id).collection("jobs").stream()
        return [doc.to_dict() for doc in docs]

    async def get_job(self, user_id: str, job_id: str):
        doc = (
            self.db.collection("users")
            .document(user_id)
            .collection("jobs")
            .document(job_id)
            .get()
        )
        return doc.to_dict() if doc.exists else None

    async def mark_job_applied(self, user_id: str, job_id: str):
        self.db.collection("users").document(user_id).collection("jobs").document(
            job_id
        ).update({"applied": True, "applied_at": firestore.SERVER_TIMESTAMP})
        return True

    # --- Tailored Resumes ---
    async def save_tailored_resume(
        self, user_id: str, job_id: str, tailored_content: str
    ):
        doc_ref = (
            self.db.collection("users")
            .document(user_id)
            .collection("tailored_resumes")
            .document()
        )
        doc_ref.set(
            {
                "job_id": job_id,
                "content": tailored_content,
                "created_at": firestore.SERVER_TIMESTAMP,
            }
        )
        return doc_ref.id


db = Database()
