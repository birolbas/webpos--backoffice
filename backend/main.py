from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def mainScreen():
    return jsonify(message = "hey")

if __name__ == "__main__":
    app.run(debug=True)