from fastapi import APIRouter, Request
from database.queries import execute_query
import json
router = APIRouter(tags=["service_charges"])


@router.post("/table_grid_save")
async def tables(request: Request):
    append_script = """ UPDATE customer_settings
                        SET tablelayout = %s
                        WHERE restaurant_name = %s """
    data = await request.json()
    values = (json.dumps(data),"TEST")
    execute_query(append_script, values)
    return data

@router.get("/getTableData")
async def getTableData():
    script = """select tablelayout from customer_settings
                where restaurant_name = %s"""
    values = ("TEST",)
    data = execute_query(script, values, True)
    return data
    
