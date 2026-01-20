from sqlalchemy.orm import Session
from . import models, schemas, security

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not security.verify_password(password, user.hashed_password):
        return False
    return user

# Google Auth
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID")

def verify_google_token(token: str):
    # 1. Try seeing if it's an ID Token (JWT)
    try:
        id_info = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
        return id_info
    except ValueError:
        pass # Not a valid ID token, maybe it's an access token?

    # 2. Try seeing if it's an Access Token (UserInfo API)
    try:
        import requests
        response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {token}"}
        )
        if response.status_code == 200:
            return response.json() # Returns dict with 'email', 'name', 'sub' etc
    except Exception as e:
        print(f"Google Auth Error: {e}")
        return None
    
    return None

def get_or_create_google_user(db: Session, email: str, full_name: str):
    user = get_user_by_email(db, email)
    if user:
        return user
    
    # Create new user without password
    db_user = models.User(
        email=email,
        hashed_password=None,
        full_name=full_name,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
