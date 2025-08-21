from sqlalchemy import select
from sqlalchemy import text
from DB.db_connect import DBConnector
from pgvector.sqlalchemy import Vector
from sqlalchemy.orm import Session
from DB.SqlModel.Postgresql.CityRegion import CityRegion
from DB.SqlModel.Postgresql.ServiceCategory import ServiceCategory

class SELECT_DB:
    def __init__(self):
        self.__dbconnect = DBConnector("postgresql")
        self.__postgre_db_connection = self.__dbconnect.session_connecter()
        self.__engine = self.__dbconnect._DBConnector__engine
        
    def get_service_category_all(self):
        sql="""
            SELECT * SERVICE_CATAGORY;
            """
        with self.__db_connection() as session:
            result = session.execute(text(sql))
            tables = result.fetchall()
            return tables
        

    def get_city_region_all(self):
        sql="""
            SELECT * FROM CITY_REGION;
            """
        with self.__postgre_db_connection() as session:
            result = session.execute(text(sql))
            tables = result.fetchall()
            return tables
        

    def get_similar_city_region(self, q_embedding, top_k=3):
        if hasattr(q_embedding, "tolist"):
            q_embedding = q_embedding.tolist()

        with Session(self.__engine) as session:
            distance_expr = CityRegion.embedding.l2_distance(q_embedding)

            stmt = (
                select(
                    CityRegion.city_code1,
                    CityRegion.city_code2,
                    CityRegion.city_str,
                    distance_expr.label("distance")
                )
                .order_by(distance_expr)
                .limit(top_k)
            )

            result = session.execute(stmt).all()
            
            # Row 객체를 딕셔너리로 변환하여 JSON 직렬화 문제 해결
            return [
                {
                    "city_code1": row[0],
                    "city_code2": row[1], 
                    "city_str": row[2],
                    "distance": float(row[3])
                }
                for row in result
            ]
        
    def get_similar_service_category(self, q_embedding, top_k=3):
        if hasattr(q_embedding, "tolist"):
            q_embedding = q_embedding.tolist()

        with Session(self.__engine) as session:
            distance_expr = ServiceCategory.embedding.l2_distance(q_embedding)

            stmt = (
                select(
                    ServiceCategory.contentTypeId,
                    ServiceCategory.cat1,
                    ServiceCategory.catNm,
                    distance_expr.label("distance")
                )
                .order_by(distance_expr)
                .limit(top_k)
            )

            result = session.execute(stmt).all()
            
            # Row 객체를 딕셔너리로 변환하여 JSON 직렬화 문제 해결
            return [
                {
                    "contentTypeId": row[0],
                    "cat1": row[1],
                    "catNm": row[2],
                    "distance": float(row[3])
                }
                for row in result
            ]