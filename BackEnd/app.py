import os
from logging import exception

from flask import Flask, jsonify

from BackEnd.models import db
from BackEnd.models.Category import Category
from BackEnd.models.Account import Account
from BackEnd.models.Privilege import Privilege
from BackEnd.models.Product import Product

app = Flask(__name__)
# DB_PATH = os.path.abspath(os.path.dirname(__file__)) + '/DropHive.db'
# app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:////Users/jorgecorrea/Documents/ULPGC/3º Año/1º Semestre/AP/Practicas/Examen Python/Mochila 0/DropHive/DB/DropHive.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.ensure_ascii = False
db.init_app(app)


@app.route("/productos")
def getProducts():
    try:
        productos = Product.query.all()
        toReturn = [producto.serialize() for producto in productos]
        return jsonify(toReturn), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception:
        exception("Server error ->")
        return jsonify({"a ocurrido un error"}), 500


@app.route("/privilegios")
def getPrivilegios():
    try:
        privilegios = Privilege.query.all()
        toReturn = [privilegio.serialize() for privilegio in privilegios]
        return jsonify(toReturn), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception:
        exception("Server error ->")
        return jsonify({"error": "Ha ocurrido un error"}), 500


@app.route("/cuentas")
def getCuentas():
    try:
        cuentas = Account.query.all()
        toReturn = [cuenta.serialize() for cuenta in cuentas]
        return jsonify(toReturn), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception:
        exception("Server error ->")
        return jsonify({"error": "Ha ocurrido un error"}), 500


@app.route("/categorias")
def getCategorias():
    try:
        categorias = Category.query.all()
        toReturn = [categoria.serialize() for categoria in categorias]
        return jsonify(toReturn), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception:
        exception("Server error ->")
        return jsonify({"error": "Ha ocurrido un error"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=4000)
