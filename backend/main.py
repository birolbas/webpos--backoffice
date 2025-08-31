from flask import Flask, jsonify, request
from config import conn, app
import psycopg2
from psycopg2.extras import Json ,RealDictCursor


import json
@app.route("/")
def mainScreen():
    return jsonify(message = "hey")
@app.route("/getTaxes", methods = ["GET"])
def getTaxes():
    cur = conn.cursor()
    getDataFromDB_script = """select taxes from customer_settings
                            where restaurant_name = %s"""
    values = ("TEST",)
    cur.execute(getDataFromDB_script, values)
    data = cur.fetchall()
    print(data)
    return data

@app.route("/saveTaxes", methods =["POST"])
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

@app.route("/getCategories", methods = ["GET"])
def getCategoies():
    cur = conn.cursor()
    getDataFromDB_script = """select categories from customer_settings
                            where restaurant_name = %s"""
    values = ("TEST",)
    cur.execute(getDataFromDB_script, values)
    data = cur.fetchall()
    print(data)
    return data


@app.route("/saveCategories", methods = ["POST"])
def saveCategories():
    cur = conn.cursor()
    data = request.get_json()
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

@app.route("/getCategoryTax", methods = ["GET"])
def getCategoryTax():
    cur = conn.cursor()
    getDataFromDB_script = """select categories, taxes from customer_settings
                            where restaurant_name = %s"""
    values = ("TEST",)
    cur.execute(getDataFromDB_script, values)
    data = cur.fetchall()
    print(data)
    return data

@app.route("/saveProducts", methods=["POST"])
def saveProducts():
    cur = conn.cursor()
    data = request.get_json()
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
    
@app.route("/getProducts", methods=["GET"])
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
    
@app.route("/savePaymentMethods", methods = ["POST"])
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

@app.route("/getPaymentMethods", methods = ["GET"])
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
    
@app.route("/table_grid_save", methods=["POST"])
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
@app.route("/getTableData", methods = ["GET"])
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
@app.route("/getIngredients", methods =["GET"])
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

@app.route("/deleteIngredient", methods = ["POST"])
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
    
@app.route("/saveIngredients", methods = ["POST"])
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

if __name__ == "__main__":
    app.run(debug=True)