# AI Report
- 작성자 : 오상민
- 목적 : 2팀 조별과제 '온쉼 여행 프로젝트 중 사용된 AI 로직에 대한 구체적인 설명 및 정리하기 위함.
- 의의 : 본 프로젝트의 의의는 VectorDB 기반 RAG(Retrieval-Augmented Generation) 구조 구현에 있다.
    + 단순히 LLM을 이용하는 것이 아닌 임베딩을 통해 데이터베이스에 vector 형태로 변환 및 저장.
    + User의 질의에 대해 유사도 분석(Similarity Search)을 통해 검색(Retriever)을 진행.
    + 검색한 값에 따라, Param 생성하고, 이를 API 요청을 통해 외부 데이터를 갖고와 이를 프롬프트에 적용.
---
## 1. 개발 환경 구축 
1. 개발환경 및 패키지 사용
    - WSL2.0 환경에서 poetry-v0.1.0 을 사용해 가상환경을 구축.
    - 사용 패키지는 아래와 같다.
    ```
    python = "^3.12"
    fastapi = "^0.116.1"
    uvicorn = {extras = ["standard"], version = "^0.35.0"}
    sqlalchemy = "^2.0.42"
    python-dotenv = "^1.1.1"
    sqlmodel = "^0.0.24"
    pydantic = "^2.11.7"
    pyyaml = "^6.0.2"
    langchain = "^0.3.27"
    langchain-core = "^0.3.72"
    langchain-openai = "^0.3.28"
    notebook = "^7.4.5"
    ipykernel = "^6.30.1"
    pandas = "^2.3.1"
    pgvector = "^0.4.1"
    numpy = "^2.3.2"
    faiss-cpu = "^1.11.0.post1"
    psycopg2-binary = "^2.9.10"
    matplotlib = "^3.10.5"
    scikit-learn = "^1.7.1"
    ```
1. vector DB 환경 구축
    pgvector 가 설치되어있는 postgres를 사용해 설치한다.  
    수동적으로 설치하는 방법도 있으나 매우 번거롭다.
    ```
    docker run -d ^
    --name team-postgres ^
    --network postgres-fastapi ^
    -e POSTGRES_PASSWORD=1234 ^
    -e POSTGRES_DB=postgres ^
    -v pg_data:/var/lib/postgresql/data ^
    -p 5432:5432 ^
    pgvector/pgvector:pg17
    ```


## 2. AI 로직 및 알고리즘 설명
![ai_data_flow](./ai_report_img/ai_data_flow.png)
    1. 질문 전처리 : 질문이 주어지면서 

