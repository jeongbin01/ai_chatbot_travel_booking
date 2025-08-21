from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class User(SQLModel, table=True):
    user_id: Optional[int] = Field(default=None, primary_key=True)
    
    username: str = Field(nullable=False, unique=True)
    password_hash: str = Field(nullable=False)
    email: str = Field(nullable=False, unique=True)
    
    phone_number: Optional[str] = None
    nickname: Optional[str] = None
    profile_image_url: Optional[str] = None
    
    registration_date: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    last_login_date: Optional[datetime] = None

    is_active: bool = Field(default=True, nullable=False)
    user_role: Optional[str] = None
