from sqlmodel import Field, SQLModel

class FormBdRecentAiTag(SQLModel,table=True ):
    __tablename__ = 'bd_recent_ai_tag'
    
    post_id: int = Field(primary_key=True)
    hashtag: str = Field(primary_key=True)
    frdt: str = Field(default="")
    frusrid: int = Field(default=113)    
    ord: int = Field(default=1)