from database.config import get_db_connection
def execute_query(query, params=None, fetch=False):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, params)
            if fetch:
                return cur.fetchall()
            conn.commit()
    except Exception as error:
        raise error
    
