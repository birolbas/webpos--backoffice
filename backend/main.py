from flask import jsonify, request
from database.config import conn, app
import psycopg2
from psycopg2.extras import Json ,RealDictCursor
from decimal import Decimal
from fastapi import FastAPI, Request
from database.config import SERVER_CONFIG

@app.get("/")
async def lobby():
    return {"message": "Restaurant Management System API", "docs": "/docs"}

import json
@app.get("/")
def mainScreen():
    return jsonify(message = "hey")
@app.get("/getTaxes")
def getTaxes():
    cur = conn.cursor()
    getDataFromDB_script = """select taxes from customer_settings
                            where restaurant_name = %s"""
    values = ("TEST",)
    cur.execute(getDataFromDB_script, values)
    data = cur.fetchall()
    print(data)
    return data

@app.post("/saveTaxes")
def saveTaxes():
    cur = conn.cursor()
    data = request.get_json()
    data = json.dumps(data)
    saveDataToDB_script = """UPDATE customer_settings
                            SET taxes = %s
                            WHERE restaurant_name = %s
                            """
    values = (data, "TEST")
    try:
        cur.execute(saveDataToDB_script,values)
        conn.commit()
    except psycopg2.Error as error:
        print(error)
    return data

@app.get("/getCategories")
def getCategoies():
    cur = conn.cursor()
    getDataFromDB_script = """select categories from customer_settings
                            where restaurant_name = %s"""
    values = ("TEST",)
    cur.execute(getDataFromDB_script, values)
    data = cur.fetchall()
    print(data)
    return data


@app.post("/saveCategories")
async def saveCategories(request: Request):
    cur = conn.cursor()
    data = await request.json()
    data = json.dumps(data)
    saveDataToDB_script = """UPDATE customer_settings
                            SET categories = %s
                            WHERE restaurant_name = %s
                            """
    values = (data, "TEST")
    try:
        cur.execute(saveDataToDB_script,values)
        conn.commit()
    except psycopg2.Error as error:
        print(error)
    return data

@app.get("/getCategoryTax")
def getCategoryTax():
    cur = conn.cursor()
    getDataFromDB_script = """select categories, taxes from customer_settings
                            where restaurant_name = %s"""
    values = ("TEST",)
    cur.execute(getDataFromDB_script, values)
    data = cur.fetchall()
    print(data)
    return data

@app.post("/saveProducts")
async def saveProducts(request: Request):
    cur = conn.cursor()
    data = await request.json()
    print(data)
    saveProducts_script = """ update products
    set products =%s
    where restaurantname = %s  """
    values = (Json(data),"TEST")
    try:
        cur.execute(saveProducts_script, values)
        conn.commit()
        return jsonify({"message":"was successfull"},200)
    except psycopg2.Error as error:
        return jsonify({"message":"was not successfull"},400)
    
@app.get("/getProducts")
def getProducts():
    cur = conn.cursor()
    getData_Script = "select products from products where restaurantname = %s"
    values = ("TEST",)
    try:
        cur.execute(getData_Script, values)
        data = cur.fetchall()
        return data
    except psycopg2.Error as error:
        return jsonify({"message":"was not successfull"},400)
    
@app.post("/savePaymentMethods")
def savePaymentMethods():
    cur = conn.cursor()
    data = request.get_json()
    setDataToDb_script = """ update customer_settings 
                            set paymentMethods = %s 
                            where restaurant_name = %s"""
    values = (json.dumps(data), "TEST")
    try:
        cur.execute(setDataToDb_script, values)
        conn.commit()
        return jsonify({"message":"was successfull"},200)
    except psycopg2.Error as error:
        return jsonify({"message":"was not successfull"},400)

@app.get("/getPaymentMethods")
def getPaymentMethods():
    cur = conn.cursor()
    getData_script = """select paymentMethods from customer_settings
                        where restaurant_name = %s """
    values = ("TEST",)
    try:
        cur.execute(getData_script, values)
        data = cur.fetchall()
        return data
    except psycopg2.Error as error:
        return jsonify({"message":"was not successfull"},400)
    
@app.post("/table_grid_save")
def tables():
    append_script = """ UPDATE customer_settings
                        SET tablelayout =%s
                        WHERE restaurant_name = %s """
    cur = conn.cursor()
    data = request.get_json()
    values = (json.dumps(data),"TEST")
    cur.execute(append_script, values)
    conn.commit()
    return data
@app.get("/getTableData")
def getTableData():
    script = """select tablelayout from customer_settings
                where restaurant_name = %s"""
    cur = conn.cursor()
    values = ("TEST",)
    try:
        cur.execute(script, values)
        data = cur.fetchall()
        print(data)
        return data
    except psycopg2.Error as error:
        return jsonify({"message":"was not successfull"},400)
@app.get("/getIngredients")
def getDataFromDB():
    script = """select * from ingredients
                where restaurant_name = %s"""
    values = ("TEST",)
    cur = conn.cursor()
    try:
        cur.execute(script, values)
        rows = cur.fetchall()
        columns = [description[0] for description in cur.description]
        data = []
        for row in rows:
            data.append(dict(zip(columns, row)))
        return data
    
    except psycopg2.Error as error:
        return jsonify({"message":"was not successfull"}), 400

@app.post("/deleteIngredient")
def deleteIngredient():
    data = request.get_json()
    print(data)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    script = """delete from ingredients where id = %s """
    values = (data,)
    try:
        cur.execute(script, values)
        conn.commit()
        return data
    except psycopg2.Error as error:
        return jsonify({"message":"was not successfull"}), 400
    
@app.post("/saveIngredients")
def saveIngredients(): 
    data = request.get_json()
    print(data)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    script = """insert into ingredients(restaurant_name, name, unit, cost_per_unit) 
                values(%s, %s, %s, %s)
            """
    values = ("TEST", (data["name"]), data["unit"], data["cost_per_unit"])
    try:
        cur.execute(script, values)
        conn.commit()
        return data
    except psycopg2.Error as error:
        return jsonify({"message":"was not successfull"}), 400
    
@app.post("/saveSubRecipe")
async def saveSubRecipe(request: Request): 
    data = await request.json()
    print(data)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    script = """insert into recipes(restaurant_name, recipename, ingredients, subRecipes, unit, isSubRecipe) 
                values(%s, %s, %s, %s, %s, %s)
            """
    values = ("TEST", (data["recipeName"]), json.dumps(data["recipeIngredients"]), json.dumps(data["recipeSubRecipes"]), data["recipeUnit"], bool(data["isSubRecipe"]))
    try:
        cur.execute(script, values)
        conn.commit()
        return data
    except psycopg2.Error as error:
         print("DB Error:", error.pgerror)
         return jsonify({"message":"was not successfull"}), 400
    
@app.delete("/saveUpdatedRecipes")
async def saveUpdatedRecipes(request: Request):
    id = await request.json()
    id = id["id"]
    script = """DELETE FROM recipes where id = %s AND restaurant_name=%s"""
    values = (id, "TEST")
    cur = conn.cursor()
    cur.execute(script, values)
    return id

    
@app.get("/getRecipes")
def getRecipes():
    script = """select * from recipes
                where restaurant_name = %s"""
    values = ("TEST",)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute(script, values)
        data = cur.fetchall()
        print(data)
        return data
    except psycopg2.Error as error:
        return jsonify({"message":"was not successfull"}), 400

@app.post("/saveServiceCharges")
def saveServiceCharges():
    data = json.dumps(request.get_json())
    script = """UPDATE customer_settings 
                SET servicecharges =%s
                where restaurant_name = %s"""
    values=(data, "TEST")
    cur = conn.cursor()
    try:
        cur.execute(script, values)
        conn.commit()
        return data
    except psycopg2.Error as error:
        return jsonify({"message":"was not successfull"}), 400
    
@app.get("/getServiceCharges")
def getServiceCharges():
    script = """SELECT servicecharges FROM customer_settings"""    
    values = ("TEST",)
    cur = conn.cursor()
    try:
        cur.execute(script, values)
        data = cur.fetchall()
        return data
    except psycopg2.Error as error:
        print(error)
        return jsonify({"message":"was not successfull"}), 400
        
@app.get("/getDiscounts")
def getDiscounts():
    script = """SELECT discounts FROM customer_settings"""    
    values = ("TEST",)
    cur = conn.cursor()
    try:
        cur.execute(script, values)
        data = cur.fetchall()
        return data
    except psycopg2.Error as error:
        print(error)
        return jsonify({"message":"was not successfull"}), 400
    
@app.post("/saveDiscounts")
def saveDiscounts():
    data = json.dumps(request.get_json())
    script = """UPDATE customer_settings 
                SET discounts =%s
                where restaurant_name = %s"""
    values=(data, "TEST")
    cur = conn.cursor()
    try:
        cur.execute(script, values)
        conn.commit()
        return data
    except psycopg2.Error as error:
        return jsonify({"message":"was not successfull"}), 400
@app.post("/saveCondimentItems")  
async def saveCondimentItems(request: Request):
    data = await request.json()
    script = """INSERT INTO combo_products(restaurant_name, name, category, related_recipe, price)
                values(%s, %s, %s, %s, %s)"""
    values = ("TEST", data["name"], data["category"], data["relatedRecipe"], data["price"])
    cur = conn.cursor()
    try:
        cur.execute(script, values)
        conn.commit()
        return data
    except psycopg2.Error as error:
        return jsonify({"message":"was not successfull"}), 400
@app.get("/getCondimentItems")
async def getCondimentItems():
    script = """SELECT * FROM combo_products where restaurant_name = %s"""
    values = ("TEST",)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        cur.execute(script, values)
        data = cur.fetchall()
        return [dict(row) for row in data]
    except psycopg2.Error as error:
        print(error)
        return jsonify({"message":"was not successfull"}), 400

@app.post("/saveCondimentGroups")
async def saveCondimentGroups(request: Request):
    data = await request.json()
    print(data)
    script = """INSERT INTO combo_groups(restaurant_name, name, items)
                values(%s, %s, %s)"""
    values = ("TEST", data["groupName"], json.dumps(data["condimentCategories"]))
    cur = conn.cursor()
    try:
        cur.execute(script, values)
        conn.commit()
        return data
    except psycopg2.Error as error:
        return jsonify({"message":"was not successfull"}), 400

@app.get("/getCondimentGroups")
def saveCondimentGroups(request: Request):
    script = """SELECT * FROM combo_groups"""    
    values = ("TEST",)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        cur.execute(script, values)
        data = cur.fetchall()
        print(data)
        return [dict(row) for row in data]
    except psycopg2.Error as error:
        print(error)
        return jsonify({"message":"was not successfull"}), 400
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",  # module_name:variable_name
        host=SERVER_CONFIG["host"], 
        port=SERVER_CONFIG["port"], 
        reload=SERVER_CONFIG["reload"]
    )
