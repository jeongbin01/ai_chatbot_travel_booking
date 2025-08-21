from sqlalchemy import Column, String
from sqlalchemy.orm import declarative_base
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class ServiceCategory(Base):
    __tablename__ = "service_category"

    contentTypeId = Column(String, primary_key=True)
    cat1 = Column(String, primary_key=True)
    catNm = Column(String)
    embedding = Column(Vector(1536))