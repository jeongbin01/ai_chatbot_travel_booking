import requests
import os
from dotenv import load_dotenv
from openai import OpenAI
from CRUD.select import SELECT_DB

class TourApiDomain:
    def __init__(self):
        load_dotenv()        
        self.__url = "https://apis.data.go.kr/B551011/KorService2/areaBasedList2"
        self.__client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.__service_key = os.getenv("TOURAPI_SERVICE_KEY")

    def question_to_param(self, question):
        selectDB_instance = SELECT_DB()
        words = question.replace(".", " ").split()
        all_row1 = []
        all_row2 = []
        for word in words:
            q_emb = self.__client.embeddings.create(
                model="text-embedding-3-small",
                input=word
            ).data[0].embedding
            rows1 = selectDB_instance.get_similar_city_region(q_emb, top_k=3)  
            rows2 = selectDB_instance.get_similar_service_category(q_emb, top_k=3)
            all_row1.extend(rows1)
            all_row2.extend(rows2)

        best_row1 = sorted(all_row1, key=lambda x: x["distance"])[:1]
        best_row2 = sorted(all_row2, key=lambda x: x["distance"])[:1]
        # print(best_row1, best_row2)
        return best_row1, best_row2

        

    def call_response(self, question):
        best_row1s, best_row2s = self.question_to_param(question)
        best_row1 = best_row1s[0]
        best_row2 = best_row2s[0]
        
        # SELECT_DB를 수정했다면 딕셔너리 형태로 접근
        region_code = best_row1["city_code1"]
        sigungu_code = best_row1["city_code2"]
        
        content_type_id = best_row2["contentTypeId"]
        cat1 = best_row2["cat1"]

        params = {
            "MobileOS": "WEB",
            "MobileApp": "TOUR_AI",
            "serviceKey": self.__service_key,
            "numOfRows": "10",
            "pageNo": "1",
            "_type": "json"
        }
        
        # None이 아닌 값들만 추가
        if region_code:
            params["lDongRegnCd"] = str(region_code)
        if sigungu_code:
            params["lDongSignguCd"] = str(sigungu_code)
        if content_type_id:
            params["contentTypeId"] = str(content_type_id)
        if cat1:
            params["cat1"] = str(cat1)
        
        response = requests.get(self.__url, params=params)
        
        if response.status_code == 200:
            try:
                data = response.json()
                items = data["response"]["body"]["items"]["item"]
                service_data = []
                for item in items:
                    service = {
                        "addr1": item.get("addr1", ""),   # key 없을 경우 대비해서 .get() 사용
                        "title": item.get("title", "")
                    }
                    service_data.append(service)
                    
                return {
                    "data": service_data
                }
            except requests.exceptions.JSONDecodeError:
                return {"status": "error", "message": "API 응답을 JSON으로 파싱할 수 없습니다."}
        else:
            return {
                "status": "error", 
                "message": f"API 호출 실패: {response.status_code}",
                "response_text": response.text[:500]
            }
