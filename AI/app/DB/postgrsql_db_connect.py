from datetime import datetime, timedelta
from sqlalchemy import create_engine, text, Table, MetaData
from urllib.parse import quote_plus
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
import os

class PostgresqlDBConnector:
    def __init__(self):
        load_dotenv()

        self.__DB_INFO = {"host" : "127.0.0.1",
            "port" : 5432,
            "db" : "postgres",
            "user" : "postgres",
            "passwd" : quote_plus(os.getenv("POSTGRES_SQL_DB_PASSWORD"))
        }

        self.__engine = create_engine(
            # postgresql+psycopg2://postgres:1234@localhost:5432/postgres
            f"postgresql+psycopg2://{self.__DB_INFO['user']}:{self.__DB_INFO['passwd']}@{self.__DB_INFO['host']}:{str(self.__DB_INFO['port'])}/{self.__DB_INFO['db']}"
        )

    def session_connecter(self):
        Session = sessionmaker(bind=self.__engine, autoflush=False, autocommit=False)
        return Session   
