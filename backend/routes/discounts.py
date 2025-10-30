from fastapi import APIRouter, Request
from database.queries import execute_query
router = APIRouter(tags=["discounts"])
@router.get("/getDiscounts")
def getDiscounts():
    script = """SELECT * FROM discounts"""    
    values = ("TEST",)
    data = execute_query(script, values, True)
    return data 

@router.post("/saveDiscounts")
async def saveDiscounts(request: Request):
    data = await request.json()
    print(data)
    script = """insert into discounts(restaurant_name, name, is_fixed, amount)
                values(%s,%s, %s, %s)"""
    values=("TEST", data["name"], data["is_fixed"], data["amount"])
    returning_data = execute_query(script, values)
    return returning_data

@router.put("/saveEditedDiscount")
async def saveEditedDiscount(request: Request):
    data = await request.json()
    script = """UPDATE discounts
                SET name = %s,
                    is_fixed = %s,
                    amount = %s
                WHERE restaurant_name = %s AND id = %s
                """
    values = (data["name"], data["is_fixed"], data["amount"], "TEST", data["id"])
    execute_query(script, values)
    return data

@router.delete("/deleteDiscount")
async def deleteDiscount(request: Request):
    data = await request.json()
    print(data)
    script = """DELETE FROM discounts
                WHERE restaurant_name = %s AND id = %s
                """
    values = ("TEST", data)
    execute_query(script, values)
    return data