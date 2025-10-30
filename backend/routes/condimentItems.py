from fastapi import APIRouter, Request
from database.queries import execute_query
from database.config import get_db_connection
import psycopg2.extras
router = APIRouter(tags=["condiment_items"])

@router.post("/saveCondimentItems")  
async def saveCondimentItems(request: Request):
    data = await request.json()
    script = """INSERT INTO combo_products(restaurant_name, name, category, related_recipe, price)
                values(%s, %s, %s, %s, %s) returning id"""
    values = ("TEST", data["name"], data["category"], data["relatedRecipe"], data["price"])
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(script, values)
            id = cur.fetchall()
            conn.commit()
    except Exception as error:
        raise error
    return id

@router.get("/getCondimentItems")
async def getCondimentItems():
    combo_products_script = """SELECT * FROM combo_products where restaurant_name = %s"""
    values = ("TEST",)
    combo_products = execute_query(combo_products_script, values, True)
    recipe_script = """select * from recipes where restaurant_name = %s and is_sub_recipe = false"""
    recipes = execute_query(recipe_script, values, True )
    data = {
        "combo_products": combo_products,
        "recipes": recipes
    }
    return data
@router.put("/editCondimentItems")
async def editCondimentItems(request: Request):
    data = await request.json()
    script = """UPDATE combo_products
                SET 
                    name = %s,
                    category = %s,
                    price = %s
                WHERE id = %s and restaurant_name = %s
                """
    values = (data["name"], data["category"], data["price"], data["id"], "TEST")
    execute_query(script, values)
    return data
    
@router.delete("/deleteCondimentItem")
async def editCondimentItems(request: Request):
    data = await request.json()
    print(data)
    script = """DELETE FROM combo_products 
                WHERE id = %s and restaurant_name = %s
                """
    values = (data, "TEST")
    execute_query(script, values)
    return data
    