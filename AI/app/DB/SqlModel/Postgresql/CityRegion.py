from sqlalchemy import Column, String
from sqlalchemy.orm import declarative_base
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class CityRegion(Base):
    __tablename__ = "city_regions"

    city_code1 = Column(String, primary_key=True)
    city_code2 = Column(String, primary_key=True)
    city_str = Column(String)
    embedding = Column(Vector(1536))
