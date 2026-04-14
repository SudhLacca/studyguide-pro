from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt
import os
from dotenv import load_dotenv

load_dotenv()

# Security Configurations
# In a real production app, this secret key should be a long random string in your .env file
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-development-key-12345")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # Token lasts for 1 week

# Password Hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """Check if the provided password matches the hashed one in the database"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Scramble the password before saving it to the database"""
    return pwd_context.hash(password)

def create_access_token(data: dict):
    """Generate a JWT token for the user to stay logged in"""
    to_encode = data.copy()
    
    # Set expiration time
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    # Create the token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt