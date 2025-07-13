from datetime import datetime, timedelta
from sqlalchemy import create_engine, text, Table, MetaData
from urllib.parse import quote_plus
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
import os

class DBConnector:
    def __init__(self):
        load_dotenv()

        self.__DB_INFO = {"host" : "192.168.0.70",
            "port" : 3306,
            "db" : "prpt",
            "user" : "root",
            "passwd" : quote_plus(os.getenv("MYSQL_DB_PASSWORD"))
        }

        self.__engine = create_engine(
            f"mysql+pymysql://{self.__DB_INFO['user']}:{self.__DB_INFO['passwd']}@{self.__DB_INFO['host']}:{str(self.__DB_INFO['port'])}/{self.__DB_INFO['db']}"
        )

    def session_connecter(self):
        Session = sessionmaker(bind=self.__engine, autoflush=False, autocommit=False)
        return Session   
