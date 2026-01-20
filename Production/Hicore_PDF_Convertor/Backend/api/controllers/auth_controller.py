from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from core.database import get_db
from modules.auth import schemas, service, security
from datetime import timedelta
from core.limiter import limiter

router = APIRouter()

@router.post("/auth/signup", response_model=schemas.UserResponse)
@limiter.limit("5/minute")
def signup(request: Request, user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = service.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return service.create_user(db=db, user=user)

@router.post("/auth/login", response_model=schemas.Token)
@limiter.limit("5/minute")
def login(request: Request, form_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = service.authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/auth/google", response_model=schemas.Token)
@limiter.limit("5/minute")
def google_login(request: Request, login_data: schemas.GoogleLogin, db: Session = Depends(get_db)):
    # Verify the token with Google
    print(f"Received Google Token: {login_data.token[:20]}...")
    google_data = service.verify_google_token(login_data.token)
    
    if not google_data:
        print("Google Token Verification Failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google Token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"Google Data Decoded: {google_data}") # DEBUG LOG
    
    # Get email and name from validated token
    email = google_data.get("email")
    name = google_data.get("name")
    
    if not email:
        print("No email in google data")
        raise HTTPException(status_code=400, detail="Google token missing email")

    # Get or create user
    print(f"Attempting to get or create user: {email}")
    user = service.get_or_create_google_user(db, email=email, full_name=name)
    print(f"User ID from DB: {user.id}")
    
    # Create Access Token
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

from modules.auth.dependencies import get_current_user

@router.get("/auth/me", response_model=schemas.UserResponse)
def read_users_me(current_user: schemas.UserResponse = Depends(get_current_user)):
    return current_user
