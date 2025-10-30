from fastapi import APIRouter, Request
from database.queries import execute_query
from database.config import get_db_connection
import psycopg2.extras
from psycopg2.extras import execute_values
import json
router = APIRouter(tags=["recipes"])

@router.post("/saveSubRecipe")
async def saveSubRecipe(request: Request): 
    data = await request.json()
    print(data)
    recipe_script = """insert into recipes(restaurant_name, name, is_sub_recipe) 
                values(%s, %s, %s)
                returning id"""
    values = ("TEST", (data["recipeName"]), bool(data["isSubRecipe"]))
    conn = get_db_connection()

    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(recipe_script, values)
            recipe_id = cur.fetchall()
            conn.commit()
    except Exception as error:
        raise error
    
    recipe_items_script = """insert into recipe_items(restaurant_name, recipe_id, ingredient_id, quantity, unit)
                             values %s"""
    item_values = [("TEST", recipe_id[0]["id"], ingredient["id"], ingredient["amount"], ingredient["unit"]) for ingredient in data["recipeIngredients"]]
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            execute_values(cur, recipe_items_script, item_values)
            conn.commit()
    except Exception as error:
        raise error    
    return data
@router.post("/saveUpperRecipe")
async def saveUpperRecipe(request: Request):
    data = await request.json()
    print(data)
    recipe_script = """insert into recipes(restaurant_name, name, is_sub_recipe) 
                values(%s, %s, %s)
                returning id"""
    values = ("TEST", (data["recipeName"]), bool(data["isSubRecipe"]))
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(recipe_script, values)
            recipe_id = cur.fetchall()
            conn.commit()
    except Exception as error:
        raise error

    recipe_items_script = """insert into recipe_items(restaurant_name, recipe_id, ingredient_id, quantity, unit)
                             values %s"""
    item_values = [("TEST", recipe_id[0]["id"], ingredient["id"], ingredient["amount"], ingredient["unit"]) for ingredient in data["recipeIngredients"]]
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            execute_values(cur, recipe_items_script, item_values)
            conn.commit()
    except Exception as error:
        raise error    
    
    recipe_sub_recipe_script = """insert into recipe_subrecipes(restaurant_name, recipe_id, subrecipe_id, amount)
                                    values %s"""
    sub_recipe_values = [("TEST", recipe_id[0]["id"], subrecipe["id"], subrecipe["amount"]) for subrecipe in data["recipeSubRecipes"] if subrecipe["id"] if isinstance(subrecipe["id"], int)]
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            execute_values(cur, recipe_sub_recipe_script, sub_recipe_values)
            conn.commit()
    except Exception as error:
        raise error   
    return data


@router.delete("/saveUpdatedRecipes")
async def saveUpdatedRecipes(request: Request):
    id = await request.json()
    id = id["id"]
    script = """DELETE FROM recipes where id = %s AND restaurant_name=%s"""
    values = (id, "TEST")
    cur = conn.cursor()
    cur.execute(script, values)
    return id

    
@router.get("/getRecipes")
async def getRecipes():
    script = """select  r.id,
		r.name,
    	COALESCE(SUM(ri.quantity * i.cost_per_unit), 0) AS ingredient_cost,
    	COALESCE(SUM(sr.sub_cost), 0) AS sub_recipe_cost,
		COALESCE(SUM(ri.quantity * i.cost_per_unit), 0) + COALESCE(SUM(sr.sub_cost), 0) AS total_cost,
        r.is_sub_recipe
	from recipes r  
	left join recipe_items ri on ri.recipe_id = r.id
	left join ingredients i on i.id = ri.ingredient_id
	LEFT JOIN recipe_subrecipes rs ON rs.recipe_id = r.id
LEFT JOIN (
    SELECT 
        r2.id AS sub_id,
        SUM(ri2.quantity * i2.cost_per_unit) AS sub_cost
    FROM recipes r2
    JOIN recipe_items ri2 ON ri2.recipe_id = r2.id
    JOIN ingredients i2 ON i2.id = ri2.ingredient_id
    WHERE r2.is_sub_recipe = true
    GROUP BY r2.id
) sr ON sr.sub_id = rs.subrecipe_id
	where r.restaurant_name = %s 
	group by r.id, r.name 
"""
    values = ("TEST",)
    data = execute_query(script, values, True)
    return data

@router.get("/getSubRecipeAndIngredients")
async def getSubRecipeAndIngredients():
    ingredient_script = """select * from ingredients where restaurant_name = %s"""
    values = ("TEST",)
    subrecipe_script = """select  r.id,
                        r.name,
                        sum(ri.quantity * i.cost_per_unit) as cost_per_unit
                    from recipes r 
                    left join recipe_items ri on ri.recipe_id = r.id
                    left join ingredients i on i.id = ri.ingredient_id
                    where r.is_sub_recipe = true and r.restaurant_name = %s
                    group by r.id, r.name """
    ingredients = execute_query(ingredient_script, values, True)
    subRecipes = execute_query(subrecipe_script, values, True)
    data = {
        "ingredients": ingredients,
        "sub_recipes": subRecipes
    }
    return data


@router.get("/getSubRecipeToEdit")
async def get_sub_recipe_to_edit(edit_id: int):
    
    print("data is ", edit_id, "tpye", type(edit_id))
    ingredient_script = """SELECT 
                                r.name AS recipe_name,
                                i.id,
                                i.name ,
                                i.unit,
                                ri.quantity,
                                i.cost_per_unit,
                                ROUND(ri.quantity * i.cost_per_unit, 2) AS total_cost
                            FROM recipes r 
                            JOIN recipe_items ri ON ri.recipe_id = %s
                            JOIN ingredients i ON ri.ingredient_id = i.id
                            WHERE r.id = %s
                            """
    
    subrecipes_script = """
                            SELECT 
                                rs.id,
                                r_sub.name,
                                rs.amount,
                                ROUND(SUM(ri.quantity * i.cost_per_unit),2) AS total_cost,
                                ROUND((SUM(ri.quantity * i.cost_per_unit) / rs.amount),2) AS cost_per_unit
                            FROM recipe_subrecipes rs
                            JOIN recipes r_sub ON r_sub.id = rs.subrecipe_id
                            JOIN recipe_items ri ON ri.recipe_id = r_sub.id
                            JOIN ingredients i ON ri.ingredient_id = i.id
                            WHERE rs.recipe_id = %s
                            GROUP BY rs.id, r_sub.name, rs.amount;
                        """
    
    ingredient_values = (edit_id, edit_id)
    values = (edit_id,)
    ingredients = execute_query(ingredient_script, ingredient_values, True)
    sub_recipes = execute_query(subrecipes_script, values, True)
    print(sub_recipes)
    sub_recipe_cost = sum(sub_recipe["total_cost"] for sub_recipe in sub_recipes)
    ingredient_cost = sum(ingredient["total_cost"] for ingredient in ingredients)
    total_cost = sub_recipe_cost + ingredient_cost
    data = {
        "ingredients": ingredients,
        "sub_recipes": sub_recipes,
        "sub_recipe_cost": sub_recipe_cost,
        "ingredient_cost": ingredient_cost,
        "total_cost": total_cost
    }
    return data 

@router.delete("/deleteRecipe")
async def deleteRecipe(request: Request):
    data = await request.json()
    print(data)
    values = (data["id"],)
    recipe_items_delete_script = """DELETE FROM recipe_items WHERE recipe_id = %s """
    recipe_subrecipes_delete_script = """DELETE FROM recipe_subrecipes WHERE recipe_id = %s"""
    recipes_delete = """DELETE FROM recipes where id = %s"""
    execute_query(recipe_items_delete_script ,values)
    if not data["is_sub_recipe"]:
        execute_query(recipe_subrecipes_delete_script, values)
    execute_query(recipes_delete, values)
    return data
