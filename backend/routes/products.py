from fastapi import APIRouter, Request
from database.queries import execute_query
from database.config import get_db_connection
import psycopg2.extras
router = APIRouter(tags=["products"])

@router.post("/saveProducts")
async def saveProducts(request: Request):
    data = await request.json()
    print("GELEN DATA", data)
    conn = get_db_connection()
    saveProducts_script = """ insert into products(restaurant_name, name,  category_id, tax_id, price, condiment_id, related_recipe_id, stock_category_id, activeness)
                                values (%s, %s, %s, %s, %s, %s, %s, %s, %s) returning id"""
    values = ("TEST", data["name"], data["category_id"], data["tax_id"], data["price"], data["condiment_id"], data["relatedrecipe_id"], data["stockcategory_id"], data["activeness"])
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(saveProducts_script, values)
            id = cur.fetchall()
            conn.commit()
    except Exception as error:
        raise error
    return id

@router.get("/getProducts")
async def getProducts():
    getProducts_script = """select 
                            p.id,
                            p.name,
                            p.category_id,
                            p.tax_id,
                            c.name as category_name,
                            t.taxid AS tax_name,	
                            t.taxpercent as tax_percent,
                            p.price,
                            p.condiment_id,
                            p.related_recipe_id,
                            p.activeness,
                            p.stock_category_id
                        from products p
                        left join product_categories c on p.category_id = c.id
                        left join taxes t on t.id = p.tax_id
                        WHERE p.restaurant_name = %s"""
    
    recipe_script = """select * from recipes where restaurant_name = %s"""
    condimentGroups_script = """SELECT * FROM combo_groups where restaurant_name = %s"""    
    getTaxes_script = """select * from taxes
                            where restaurant_name = %s"""               
    stockCategory_script = """select * from stock_categories where restaurant_name = %s""" 
    category_script = """select * from product_categories where restaurant_name = %s """
    values = ("TEST",)
    products = execute_query(getProducts_script, values, True)
    recipes = execute_query(recipe_script, values, True)
    condimentGroups = execute_query(condimentGroups_script, values, True)
    tax_category = execute_query(getTaxes_script, values, True)
    stockCategories = execute_query(stockCategory_script, values, True)
    categories = execute_query(category_script, values, True)
    data = {
        "products": products,
        "recipes": recipes,
        "condiments": condimentGroups,
        "taxes": tax_category,
        "categories": categories,
        "stockCategories": stockCategories
    }
    return data

@router.delete("/deleteProduct")
async def deleteProduct(request: Request):
    data = await request.json()
    script = """DELETE FROM products WHERE id = %s and restaurant_name = %s """
    values = (data, "TEST")
    execute_query(script, values)
    return data

@router.put("/saveEditedProduct")
async def editProduct(request: Request):
    data = await request.json()
    print("data is ", data)
    script = """UPDATE products
                SET
                    name = %s,
                    tax_id = %s,
                    price = %s,
                    condiment_id = %s,
                    related_recipe_id = %s,
                    stock_category_id = %s,
                    activeness = %s
                WHERE restaurant_name = %s and category_id = %s
                """
    values = (data["name"], data["tax_id"], data["price"], data["condiment_id"], data["relatedrecipe_id"], data["stockcategory_id"], data["activeness"], "TEST", data["category_id"])
    execute_query(script, values)
    return data