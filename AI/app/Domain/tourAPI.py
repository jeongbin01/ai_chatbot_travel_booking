import requests
import os
from dotenv import load_dotenv

load_dotenv()
service_key = os.getenv("TOURAPI_SERVICE_KEY")

url = "https://apis.data.go.kr/B551011/KorService2/areaBasedList2"

params = {
    "MobileOS" : "WEB",
    "MobileApp" : "TOUR_AI",
    "serviceKey": service_key,
    "lDongRegnCd" : "11",
    "lDongSignguCd" : "110"
}
