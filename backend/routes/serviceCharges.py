from fastapi import APIRouter, Request
from database.queries import execute_query, returning_execute_query 
router = APIRouter(tags=["service_charges"])

@router.post("/saveServiceCharges")
async def saveServiceCharges(request: Request):
    data = await request.json()
    print(data)
    script = """insert into service_charges(restaurant_name, name, amount, is_fixed)
                values(%s, %s, %s, %s)
                returning id
                """
    values=("TEST", data["name"], data["amount"], data["is_fixed"] )
    returning_data = returning_execute_query(script, values)
    return returning_data

@router.get("/getServiceCharges")
def getServiceCharges():
    script = """SELECT * FROM service_charges"""    
    values = ("TEST",)
    data = execute_query(script, values, True)
    return data        

@router.put("/saveEditedServiceCharge")
async def saveEditedService(request: Request):
    data = await request.json()
    script = """UPDATE service_charges
                SET name = %s,
                    is_fixed = %s,
                    amount = %s
                WHERE restaurant_name = %s AND id = %s
                """
    values = (data["name"], data["is_fixed"], data["amount"], "TEST", data["id"])
    execute_query(script, values)
    return data

@router.delete("/deleteServiceCharge")
async def deleteServiceCharge(request: Request):
    data = await request.json()
    print(data)
    script = """DELETE FROM service_charges
                WHERE restaurant_name = %s AND id = %s
                """
    values = ("TEST", data)
    execute_query(script, values)
    return data