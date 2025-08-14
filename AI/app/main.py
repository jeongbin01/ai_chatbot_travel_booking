from fastapi import FastAPI, Response, APIRouter, Query
from DB import database
from sqlalchemy.orm import Session
import LangChain.QA_Chain as qac

app = FastAPI()

@app.get("/qa/{question}")
async def qa_with_db(question: str):
    result = qac.QandAChain.main_chain_invoke(question)
