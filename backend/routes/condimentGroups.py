from fastapi import APIRouter, Request
from database.queries import execute_query
from database.config import get_db_connection
import psycopg2.extras
import json
router = APIRouter(tags=["condiment_groups"])

@router.post("/saveCondimentGroups")
async def saveCondimentGroups(request: Request):
    data = await request.json()
    print(data)
    script = """INSERT INTO combo_groups(restaurant_name, name, items)
                values(%s, %s, %s)"""
    values = ("TEST", data["groupName"], (json.dumps(data["condimentCategories"])))
    execute_query(script, values)
    return data

@router.get("/getCondimentGroups")
def saveCondimentGroups(request: Request):
    combo_groups_script = """SELECT * FROM combo_groups where restaurant_name = %s"""    
    combo_items_script = """SELECT * FROM combo_products where restaurant_name = %s"""
    values = ("TEST",)

    combo_groups = execute_query(combo_groups_script, values, True)
    combo_items = execute_query(combo_items_script, values, True)
    data = {
        "combo_groups": combo_groups,
        "combo_items": combo_items
    }
    print(data)
    return data

@router.delete("/deleteCondimentGroups")
async def saveCondimentGroups(request: Request):
    data = await request.json()
    print("data is ", data)
    script = """DELETE FROM combo_groups WHERE id = %s AND restaurant_name = %s"""
    values = (data, "TEST")
    execute_query(script, values)
    return data

@router.put("/saveEditedCondimentGroups")
async def saveEditedCondimentGroups(request: Request):
    data = await request.json()
    print("data is ", data)
    script = """UPDATE combo_groups
                    SET name = %s,
                        items = %s
                    WHERE id = %s AND restaurant_name = %s"""
    values = (data["groupName"], json.dumps(data["condimentCategories"]), data["id"], "TEST")
    execute_query(script, values)
    return data
