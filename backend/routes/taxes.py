from fastapi import APIRouter, Request
from database.queries import execute_query
router = APIRouter(tags=["taxes"])
@router.get("/getTaxes")
async def getTaxes():
    getDataFromDB_script = """select * from taxes
                            where restaurant_name = %s"""
    values = ("TEST",)
    data = execute_query(getDataFromDB_script, values, True)
    return data

@router.post("/saveTaxes")
async def saveTaxes(request: Request):
    data = await request.json()
    saveDataToDB_script = """INSERT INTO taxes(restaurant_name, taxid, taxpercent)
                            values(%s,%s,%s)
                            """
    values = ("TEST", data["taxid"], data["taxpercent"])
    data = execute_query(saveDataToDB_script, values)
    return data