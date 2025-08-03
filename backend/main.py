from flask import Flask, jsonify, request
from config import conn, app
import psycopg2
import json
@app.route("/")
def mainScreen():
    return jsonify(message = "hey")
@app.route("/getTaxes", methods = ["GET"])
def getTaxes():
    cur = conn.cursor()
    getDataFromDB_script = """select * from customer_settings
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

if __name__ == "__main__":
    app.run(debug=True)