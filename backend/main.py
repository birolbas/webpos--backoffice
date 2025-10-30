from flask import jsonify, request
from database.config import conn, app, SERVER_CONFIG
import psycopg2
from psycopg2.extras import Json ,RealDictCursor
from fastapi import FastAPI, Request
from routes import products, paymentMethods ,taxes, discounts, serviceCharges, productCategories, ingredients, recipes, condimentItems, condimentGroups, tables

app.include_router(products.router)
app.include_router(paymentMethods.router)
app.include_router(taxes.router)
app.include_router(discounts.router)
app.include_router(serviceCharges.router)
app.include_router(productCategories.router)
app.include_router(ingredients.router)
app.include_router(recipes.router)
app.include_router(condimentItems.router)
app.include_router(condimentGroups.router)
app.include_router(tables.router)

@app.get("/")
async def lobby():
    return {"message": "Restaurant Management System API", "docs": "/docs"}

import json
@app.get("/")
def mainScreen():
    return jsonify(message = "hey")

@app.post("/saveStockCategory")
async def saveStockCategory(request: Request):
    data = await request.json()
    print(data)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    if data["isUpperCategory"]:
        print("if worked")
        script = """INSERT INTO stock_categories(restaurant_name, name)
                values(%s, %s) Returning id"""
        values = ("TEST", data["name"])
        try:
            cur.execute(script, values)
            id = cur.fetchone()
            conn.commit()
            return id
        except psycopg2.Error as error:
            return jsonify({"message":"was not successfull"}), 400
    else:
        print("else worked")
        script = """INSERT INTO stock_categories(restaurant_name, name, parent_id)
                    values(%s, %s, %s) Returning id"""
        values = ("TEST", data["name"], data["parent_id"])
        print("parentid", data["parent_id"])
        try:
            cur.execute(script, values)
            id = cur.fetchone()
            conn.commit()
            return id
        except psycopg2.Error as error:
            return jsonify({"message":"was not successfull"}), 400
        
@app.get("/getStockCategory")
async def getStockCategory():
    script = """SELECT * FROM stock_categories where restaurant_name = %s"""    
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
