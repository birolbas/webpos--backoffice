from fastapi import APIRouter, Request
from database.queries import execute_query
router = APIRouter(tags=["cancel-return"])
@router.get("/getReasons")
def getReasons():
    script = """SELECT * FROM cancel_return_reasons"""    
    values = ("TEST",)
    data = execute_query(script, values, True)
    return data 

@router.post("/saveReason")
async def saveReason(request: Request):
    data = await request.json()
    print(data)
    script = """insert into cancel_return_reasons(restaurant_name, name, is_cancel, activeness)
                values(%s,%s, %s, %s)"""
    values=("TEST", data["name"], data["is_cancel"], data["activeness"])
    returning_data = execute_query(script, values)
    return returning_data

@router.put("/saveEditedReason")
async def saveEditedReason(request: Request):
    data = await request.json()
    script = """UPDATE cancel_return_reasons
                SET name = %s,
                    is_cancel = %s,
                    activeness = %s
                WHERE restaurant_name = %s AND id = %s
                """
    values = (data["name"], data["is_cancel"], data["activeness"], "TEST", data["id"])
    execute_query(script, values)
    return data

@router.delete("/deleteReason")
async def deleteReason(request: Request):
    data = await request.json()
    print(data)
    script = """DELETE FROM cancel_return_reasons
                WHERE restaurant_name = %s AND id = %s
                """
    values = ("TEST", data)
    execute_query(script, values)
    return data