from fastapi import APIRouter, Request
from database.queries import execute_query
router = APIRouter(tags=["cancel-return"])
@router.get("/getUsers")
def getUsers():
    script = """SELECT * FROM users"""    
    values = ("TEST",)
    data = execute_query(script, values, True)
    return data 

@router.post("/saveUser")
async def saveUser(request: Request):
    data = await request.json()
    print(data)
    script = """insert into users(restaurant_name, name, role, pin, phone, e_mail, activeness)
                values(%s ,%s, %s, %s, %s, %s, %s)"""
    values=("TEST", data["name"], data["role"], data["pin"], data["phone"], data["e_mail"] ,data["activeness"])
    returning_data = execute_query(script, values)
    return returning_data

@router.put("/saveEditedUser")
async def saveEditedUser(request: Request):
    data = await request.json()
    script = """UPDATE users
                SET name = %s,
                    role = %s,
                    pin = %s,
                    phone = %s, 
                    e_mail = %s,
                    activeness = %s
                WHERE restaurant_name = %s AND id = %s
                """
    values = (data["name"], data["role"], data["pin"], data["phone"], data["e_mail"], data["activeness"], "TEST", data["id"])
    execute_query(script, values)
    return data

@router.delete("/deleteUser")
async def deleteReason(request: Request):
    data = await request.json()
    print(data)
    script = """DELETE FROM users
                WHERE id = %s
                """
    values = (data,)
    execute_query(script, values)
    return data