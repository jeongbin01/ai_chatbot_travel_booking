import re
import os
import requests
from dotenv import load_dotenv
from openai import OpenAI
from CRUD.select import SELECT_DB


class TourApiDomain:
    def __init__(self):
        load_dotenv()
        self.__url = "https://apis.data.go.kr/B551011/KorService2/areaBasedList2"
        self.__client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.__service_key = os.getenv("TOURAPI_SERVICE_KEY")
        self.__select_db = SELECT_DB()

    def __get_embedding(self, text: str):
        return self.__client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        ).data[0].embedding

    def __get_best_match(self, question, db_func, top_k=3):
        words = question.replace(".", " ").split()
        all_rows = []
        for word in words:
            embedding = self.__get_embedding(word)
            rows = db_func(embedding, top_k=top_k)
            all_rows.extend(rows)
        return sorted(all_rows, key=lambda x: x["distance"])[:1]

    def __get_best_city_match(self, question, db_func, top_k=3):
        text = question.replace(".", " ")
        candidates = re.findall(r"[가-힣]+(?:시|도|구|군)", text)
        words = text.split()\
        
        if not candidates:
            words = text.split()
            merged_words = []
            i = 0
            while i < len(words):
                if i+1 < len(words) and words[i+1] in ["시", "도"]:
                    merged_words.append(words[i] + words[i+1])
                    i += 2
                elif i+1 < len(words) and words[i+1] in ["구", "군"]:
                    merged_words.append(words[i] + words[i+1])
                    i += 2
                else:
                    merged_words.append(words[i])
                    i += 1
            candidates = merged_words

        all_rows = []
        for word in candidates:
            embedding = self.__get_embedding(word)
            rows = db_func(embedding, top_k=top_k)
            all_rows.extend(rows)

        return sorted(all_rows, key=lambda x: x["distance"])[:1]


    def question_to_param(self, question: str):
        
        best_city = self.__get_best_city_match(question, self.__select_db.get_similar_city_region)
        best_service = self.__get_best_match(question, self.__select_db.get_similar_service_category)

        return best_city[0] if best_city else None, best_service[0] if best_service else None

    def __build_params(self, region, service):
        params = {
            "MobileOS": "WEB",
            "MobileApp": "TOUR_AI",
            "serviceKey": self.__service_key,
            "numOfRows": "10",
            "pageNo": "1",
            "_type": "json",
        }

        if region:
            if region.get("city_code1"):
                params["lDongRegnCd"] = str(region["city_code1"])
            if region.get("city_code2"):
                params["lDongSignguCd"] = str(region["city_code2"])

        if service:
            if service.get("contentTypeId"):
                params["contentTypeId"] = str(service["contentTypeId"])
            if service.get("cat1"):
                params["cat1"] = str(service["cat1"])

        return params

    def __call_api(self, params):
        try:
            response = requests.get(self.__url, params=params)
            response.raise_for_status()
            data = response.json()
            if not isinstance(data, dict):
                return {"status": "error", "message": "API 응답이 dict 형태가 아닙니다.", "raw": str(data)[:500]}
            return data
        except requests.exceptions.RequestException as e:
            return {"status": "error", "message": f"API 호출 실패: {str(e)}"}
        except ValueError:
            return {"status": "error", "message": "API 응답을 JSON으로 파싱할 수 없습니다."}

    def call_response(self, question: str):
        region, service = self.question_to_param(question)
        params = self.__build_params(region, service)
        data = self.__call_api(params)
        if not isinstance(data, dict) or "status" in data:
            return data

        items_container = data.get("response", {}).get("body", {}).get("items", {})

        if isinstance(items_container, dict):
            items = items_container.get("item", [])
        else:
            items = []

        if not items:
            params.pop("contentTypeId", None)
            params.pop("cat1", None)
            data = self.__call_api(params)
            if not isinstance(data, dict) or "status" in data:
                return data
            items_container = data.get("response", {}).get("body", {}).get("items", {})
            if isinstance(items_container, dict):
                items = items_container.get("item", [])
            else:
                items = []

        if not items:
            return {
                "status": "empty",
                "message": "검색 결과가 없습니다.",
                "data": [{"addr1": "", "title": "검색 결과가 없습니다."}]
            }

        service_data = [
            {"addr1": item.get("addr1", ""), "title": item.get("title", "")}
            for item in items
        ]

        return {"status": "ok", "data": service_data}
