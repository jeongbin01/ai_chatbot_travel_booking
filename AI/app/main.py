from fastapi import FastAPI, Response, APIRouter, Query
from sqlalchemy.orm import Session
import LangChain.QA_Chain as qac
from fastapi import FastAPI
from urllib.parse import unquote
from Domain.tourAPI import TourApiDomain
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
qac_instance = qac.QandAChain()
tourapi = TourApiDomain()
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 모든 도메인 허용하려면 ["*"]
    allow_credentials=True,
    allow_methods=["*"],    # GET, POST 등 모두 허용
    allow_headers=["*"],    # 모든 헤더 허용
)

@app.get("/qa/{question}")
async def qa_with_db(question: str):
    question = unquote(question)
    result = qac_instance.main_chain_invoke(question)
    return {"reply": result}


@app.get("/test/{question}")
async def test(question:str):
    tourapiData = tourapi.call_response(question)
    return tourapiData