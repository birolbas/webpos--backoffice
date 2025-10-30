from fastapi import APIRouter, Request
from database.queries import execute_query
from database.config import get_db_connection
import psycopg2.extras

router = APIRouter(tags=["discounts"])
@router.get("/getCategories")
def getCategoies(request: Request):
    getDataFromDB_script = """select * from product_categories
                                where restaurant_name = %s"""
    values = ("TEST",)
    data = execute_query(getDataFromDB_script, values, True)
    print(data)
    return data

@router.post("/saveUpperCategory")
async def saveCategories(request: Request):
    data = await request.json()
    conn = get_db_connection()
    saveDataToDB_script = """INSERT INTO product_categories(restaurant_name, name, ui_index)
                            values(%s, %s, %s)
                            returning id"""
    values = ("TEST", data["name"], data["ui_index"])
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(saveDataToDB_script, values)
            id = cur.fetchall()
            conn.commit()
    except Exception as error:
        raise error
    print(id)
    return id[0]

@router.post("/saveSubCategory")
async def saveCategories(request: Request):
    data = await request.json()
    conn = get_db_connection()
    saveDataToDB_script = """INSERT INTO product_categories(restaurant_name, name, parent_id)
                            values(%s, %s, %s) returning id"""
    values = ("TEST", data["name"], data["parent_id"])
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(saveDataToDB_script, values)
            id = cur.fetchall()
            conn.commit()
    except Exception as error:
        raise error
    print(id)
    return id[0]

@router.delete("/deleteCategory")
async def deleteCategory(request:Request):
    data = await request.json()
    print(data)
    deleteData_script = """delete from product_categories where restaurant_name = %s AND id = %s"""
    values = ("TEST", data)
    execute_query(deleteData_script, values)
    return data