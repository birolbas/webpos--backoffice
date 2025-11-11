from fastapi import APIRouter, Request
from database.queries import execute_query, returning_execute_query 
router = APIRouter(tags=["stock_moves"])

@router.get("/getIngredientsOnStockMoves")
async def getIngredientsOnStockMoves():
    ingredients_script = """SELECT id, name, unit FROM ingredients  where restaurant_name = %s"""
    values = ("TEST",)
    ingredients = execute_query(ingredients_script, values, True)
    stock_moves_script = """select sAl.id,
		sAl.ingredient_id,
		i.name,
        i.unit,
		sAl.is_add,
		sAl.stock_after_transaction,
		sAl.quantity,
		sAl.created_at
		from stock_add_loss sAl
left join ingredients i on i.id = sAl.ingredient_id where restaurant_id = %s"""
    stock_moves_values = (8,)
    stock_moves = execute_query(stock_moves_script, stock_moves_values, True )
    data = {
        "ingredients": ingredients,
        "stock_moves": stock_moves
    }
    return data

@router.post("/updateStock")
async def updateStock(request:Request):
    data = await request.json()
    stock_add_script = """INSERT INTO stock_add_loss(restaurant_id, ingredient_id, is_add, stock_after_transaction, quantity)
                          VALUES(%s,%s,%s,(
                            select stock_quantity + %s from ingredients 
                            where ingredients.id = %s
                        ),%s)returning id, stock_after_transaction, created_at"""
    stock_loss_script = """INSERT INTO stock_add_loss(restaurant_id, ingredient_id, is_add, stock_after_transaction, quantity)
                          VALUES(%s,%s,%s,(
                            select stock_quantity - %s from ingredients 
                            where ingredients.id = %s
                        ),%s)returning id, stock_after_transaction, created_at"""
    values = (8, data["ingredient_id"], data["is_add"], data["quantity"], data["ingredient_id"], data["quantity"])

    add_ingredient_stock = """UPDATE ingredients 
                                SET stock_quantity = stock_quantity + %s
                                WHERE id = %s"""
    subtract_ingredient_stock = """UPDATE ingredients 
                                SET stock_quantity = stock_quantity - %s
                                WHERE id = %s"""
    
    ingredient_values = (data["quantity"], data["ingredient_id"])
    if(data["is_add"]):
        returning_id = returning_execute_query(stock_add_script, values)
        print(returning_id)
        execute_query(add_ingredient_stock, ingredient_values)
    else:
        returning_id = returning_execute_query(stock_loss_script, values)
        print(returning_id)
        execute_query(subtract_ingredient_stock, ingredient_values)
    return returning_id
