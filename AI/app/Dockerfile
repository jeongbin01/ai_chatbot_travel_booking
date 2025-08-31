# 1. Python 기반 이미지 선택
FROM python:3.12-slim

# 2. 작업 디렉토리 생성
WORKDIR /app

# 3. poetry 설치
RUN pip install --no-cache-dir poetry

# 4. pyproject.toml & poetry.lock 복사
COPY pyproject.toml poetry.lock* ./

# 5. 패키지 설치 (dev 없이, 의존성만)
RUN poetry install --no-root

# 6. 소스코드 복사
COPY . .

# 7. Uvicorn 실행 (poetry 환경 안에서 실행)
CMD ["poetry", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "7000"]
