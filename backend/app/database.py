import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.db = None
        self._initialize_firebase()

    def _initialize_firebase(self):
        try:
            if not firebase_admin._apps:
                # Try to load service account from environment variable path
                service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
                if service_account_path and os.path.exists(service_account_path):
                    cred = credentials.Certificate(service_account_path)
                    firebase_admin.initialize_app(cred)
                else:
                    # Fallback: try to initialize without explicit credentials if already configured environment
                    firebase_admin.initialize_app()
            
            self.db = firestore.client()
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

    # --- Resumes ---
    async def save_resume(self, user_id: str, resume_data: dict):
        # Store in a sub-collection for each user
        doc_ref = self.db.collection("users").document(user_id).collection("resumes").document()
        doc_ref.set(resume_data)
        return doc_ref.id

    async def get_latest_resume(self, user_id: str):
        docs = self.db.collection("users").document(user_id).collection("resumes").order_by("timestamp", direction=firestore.Query.DESCENDING).limit(1).stream()
        for doc in docs:
            return doc.to_dict()
        return None

    # --- Job Matches ---
    async def save_job_match(self, user_id: str, match_data: dict):
        self.db.collection("users").document(user_id).collection("matches").add(match_data)
        return True

    async def get_top_matches(self, user_id: str, limit=10):
        docs = self.db.collection("users").document(user_id).collection("matches").order_by("score", direction=firestore.Query.DESCENDING).limit(limit).stream()
        return [doc.to_dict() for doc in docs]

db = Database()
