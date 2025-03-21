import os

from flask import Flask, jsonify, request

from BackEnd.models import db
from BackEnd.models.Account import Account
from BackEnd.models.Category import Category
from BackEnd.models.Privilege import Privilege
from BackEnd.models.Product import Product

app = Flask(__name__)
DB_NAME = "DropHive" + ".db"
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../DB", DB_NAME)
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.ensure_ascii = False
db.init_app(app)


@app.route("/")
def index():
    return """
    <html>
        <head>
            <title>API DropHive</title>
        </head>
        <body>
            <h1>Bienvenido a la API de DropHive</h1>
            <ul>                
                <li><a href="/products">Obtener todos los productos (/products)</a></li>
                <li><a href="/privileges">Obtener todos los privilegios (/privileges)</a></li>
                <li><a href="/accounts">Obtener todas las cuentas (/accounts)</a></li>
                <li><a href="/category">Obtener todas las categorías (/category)</a></li>
            </ul>
        </body>
    </html>
    """


@app.route("/products")
def get_products():
    try:
        return jsonify(get_all_values_from(Product)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /products: {e}")
        return jsonify({"error": "Error al obtener la lista de productos."}), 500


@app.route("/privileges")
def get_privileges():
    try:
        return jsonify(get_all_values_from(Privilege)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /privileges: {e}")
        return jsonify({"error": "Error al obtener la lista de privilegios."}), 500


@app.route("/accounts")
def get_accounts():
    try:
        return jsonify(get_all_values_from(Account)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /accounts: {e}")
        return jsonify({"error": "Error al obtener las cuentas."}), 500


@app.route("/category")
def get_category():
    try:
        return jsonify(get_all_values_from(Category)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /category: {e}")
        return jsonify({"error": "Error al obtener las categorías."}), 500


def get_all_values_from(model):
    return [item.serialize() for item in model.query.all()]


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    account = Account.query.filter_by(name=username, password=password).first()

    if account:
        return jsonify({"message": f"Bienvenido, {account.name}"}), 200
    else:
        return jsonify({"error": "Credenciales incorrectas"}), 401


if __name__ == "__main__":
    app.run(debug=True, port=4000)
