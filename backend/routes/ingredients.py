from fastapi import APIRouter, Request
from database.queries import execute_query
router = APIRouter(tags=["ingredients"])

@router.get("/getIngredients")
async def getDataFromDB():
    values = ("TEST",)
    stock_category_script = """SELECT * FROM stock_categories where restaurant_name = %s AND parent_id is not null"""
    ingredients_script = """select 
                        i.id,
                        i.name,
                        i.unit,
                        i.stock_category as stock_category_id,
                        i.stock_quantity,
                        i.cost_per_unit,
                        i.invoice_names, 
                        c.name as stock_category,
                        i.stockcheck
                from ingredients i 
                left join stock_categories c on c.id = i.stock_category
                where i.restaurant_name = %s"""
    stock_categories = execute_query(stock_category_script, values, True)
    ingredients = execute_query(ingredients_script, values, True)
    print(stock_categories)
    data = {
        "stock_categories": stock_categories,
        "ingredients": ingredients
    }
    print(data)
    return data

@router.post("/deleteIngredient")
async def  deleteIngredient(request: Request):
    data = await request.json()
    script = """delete from ingredients where id = %s """
    values = (data,)
    execute_query(script, values)
    return data

@router.post("/saveIngredients")
async def saveIngredients(request: Request): 
    data = await request.json()
    script = """insert into ingredients(restaurant_name, name,stock_category, unit, stock_quantity, stockcheck, cost_per_unit) 
                values(%s, %s, %s, %s, %s, %s, %s)
            """
    values = ("TEST", (data["name"]), data["stockCategory"] ,data["unit"], data["stockQuantity"], data["stockCheck"],  data["cost_per_unit"])
    execute_query(script, values)
    return data
    