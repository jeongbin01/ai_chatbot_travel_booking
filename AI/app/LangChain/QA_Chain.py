from langchain_core.output_parsers import StrOutputParser
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from langchain_core.output_parsers import JsonOutputParser
from Domain.tourAPI import TourApiDomain
import yaml
import os
from dotenv import load_dotenv
load_dotenv()

class Answer(BaseModel):
    contents: str = Field(default="")

class QandAChain:
    def __init__(self): 
        base_path = os.path.dirname(os.path.abspath(__file__))  # 현재 파일의 경로
        file_path = os.path.join(base_path, 'prompt', 'QandAPrompt.yaml')
        self.__openaiApiKey = os.environ["OPENAI_API_KEY"]
                
        with open(file_path, 'r') as f:
            self.__prompt_template = yaml.load(f, Loader=yaml.SafeLoader)['template']
        
        self.__model = ChatOpenAI(
            temperature = 0.1,
            model_name="gpt-4o-mini",
            max_tokens = 2048,
            openai_api_key=self.__openaiApiKey 
        )
        self.__tourapi = TourApiDomain()
        self.__parser = JsonOutputParser(pydantic_object=Answer)

    def main_chain_invoke(self, question):
        prompt = PromptTemplate.from_template(self.__prompt_template)
        tourapiData = self.__tourapi.call_response(question)
        
        prompt = prompt.partial(format_instructions=self.__parser.get_format_instructions())

        chain = prompt | self.__model | self.__parser

        result = chain.invoke({"question": question, "tourapiData":tourapiData})

        # best_row1, best_row2 = tour_api_domain_instance.question_to_param(question)
        # result = tourapiData
        return result