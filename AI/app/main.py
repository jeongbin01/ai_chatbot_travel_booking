from fastapi import FastAPI, Response, APIRouter, Query
from sqlalchemy.orm import Session
import LangChain.QA_Chain as qac
from fastapi import FastAPI
from urllib.parse import unquote
from Domain.tourAPI import TourApiDomain
app = FastAPI()
qac_instance = qac.QandAChain()
tourapi = TourApiDomain()

@app.get("/qa/{question}")
async def qa_with_db(question: str):
    question = unquote(question)
    result = qac_instance.main_chain_invoke(question)
    return result


@app.get("/test/{question}")
async def test(question:str):
    tourapiData = tourapi.call_response(question)
    return tourapiData