

class CRUD_DB:
    def __init__(self):
        self.__db_connection = dbconnect.DBConnector().session_connecter()
        self.form_brat_tag = brat.FormBdRecentAiTag()
        self.form_bram_master = bram.FormBdRecentAiMaster()


    def get_title_dcontent_all(self):
        sql="""
            SELECT post_id, title, title_ko, detail_contents FROM bd_dictionary_master WHERE POST_ID >= 23 AND POST_ID <= 25 AND DELETE_YN = 'N';
            """
        with self.__db_connection() as session:
            result = session.execute(text(sql))
            tables = result.fetchall()
            return tables