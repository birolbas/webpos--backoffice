from fastapi import APIRouter, Request
from database.queries import execute_query
from database.config import get_db_connection
import psycopg2.extras
router = APIRouter(tags=["paymentMethods"])

@router.post("/savePaymentMethods")
async def savePaymentMethods(request: Request):
    data = await request.json()
    print(data)
    conn = get_db_connection()
    setDataToDb_script = """ insert into payment_methods(restaurant_name, name, commission, includedincome)
                            values(%s, %s, %s, %s) returning id"""
    values = ("TEST", data["name"], data["commission"], data["includedincome"])

    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(setDataToDb_script, values)
            id = cur.fetchall()
    except Exception as error:
        raise error
    return id

@router.get("/getPaymentMethods")
def getPaymentMethods():
    getData_script = """select * from payment_methods
                        where restaurant_name = %s """
    values = ("TEST",)
    data = execute_query(getData_script, values, True)
    return data

@router.delete("/deletePaymentMethod")
async def deletePaymentMethod(request: Request):
    id = await request.json()
    deleteScript = """delete from payment_methods where id = %s AND restaurant_name = %s"""
    values = (id, "TEST")
    data = execute_query(deleteScript, values)
    return data
@router.put("/saveEditedMethods")
async def saveEditedMethods(request: Request):
    data = await request.json()
    script = """UPDATE payment_methods
                SET
                    name = %s,
                    commission = %s,
                    includedincome = %s
                WHERE restaurant_name = %s AND id = %s 
                """
    values = (data["name"], data["commission"], data["includedincome"], "TEST", data["id"])
    execute_query(script, values)
    return data