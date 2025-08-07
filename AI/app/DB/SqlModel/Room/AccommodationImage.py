from typing import Optional
from sqlmodel import SQLModel, Field, Relationship


class AccommodationImage(SQLModel, table=True):
    __tablename__ = "accommodation_image"

    image_id: Optional[int] = Field(default=None, primary_key=True, alias="image_id")

    accommodation_id: int = Field(foreign_key="Accommodation.accommodation_id", nullable=False)
    
    image_url: str = Field(nullable=False)
    caption: Optional[str] = Field(default=None)

    order_num: int = Field(default=0, alias="order_num")