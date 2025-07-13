from langchain_core.output_parsers import StrOutputParser
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from langchain_core.output_parsers import JsonOutputParser
import yaml
import os

class Answer(BaseModel):
    title_en: str = Field(description="")
    title_ko: str = Field(description="")
    contents: str = Field(default="")
    detail_contents: str = Field(description="")
    urls: str = Field(description="")

class QandAChain:
    def __init__(self, question):
        base_path = os.path.dirname(os.path.abspath(__file__))  # 현재 파일의 경로
        file_path = os.path.join(base_path, 'prompt', 'QandAPrompt.yaml')

        with open(file_path, 'r') as f:
            self.__prompt_template = yaml.load(f, Loader=yaml.SafeLoader)['template']
        
        self.__model = ChatOpenAI(
            temperature = 0.1,
            model_name="gpt-4o-mini",
            max_tokens = 2048,
        )
        self.__parser = JsonOutputParser(pydantic_object=Answer)

    def main_chain_invoke(self, question):
        prompt = PromptTemplate.from_template(self.__prompt_template)
        prompt = prompt.partial(format_instructions=self.__parser.get_format_instructions())

        chain = prompt | self.__model | self.__parser

        result = chain.invoke({"question": question})

        return result