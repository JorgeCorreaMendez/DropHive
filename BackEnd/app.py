import sys
import os

from flask import Flask, jsonify, request

from models import db
from models.Account import Account
from models.Category import Category
from models.Privilege import Privilege
from models.Product import Product

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from DB.initDB import createDB
from DB.funcionesProductos import *

#from sacarDatos import *
import schemas

global ruta_archivo_datos
ruta_base_datos = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../DB")
ruta_archivo_datos = os.path.join(ruta_base_datos, "DropHive" + ".db")

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

@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        #name, mail, password, phone, description, address, privilege_id = obtenerDatosRegistro(data)
        user_data = schemas.UserRegisterSchema(**data)
        global ruta_archivo_datos
        ruta_base_datos = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../DB")
        ruta_archivo_datos = os.path.join(ruta_base_datos, user_data.name + ".db")
        print(ruta_archivo_datos)
        if os.path.exists(ruta_archivo_datos):
            return jsonify({"error": f"La empresa {user_data.name} ya existe."}), 401
        else:
            createDB(ruta_archivo_datos)
            AddAccount(ruta_archivo_datos, user_data.name, user_data.mail, user_data.password, user_data.phone, user_data.description, user_data.address, user_data.privilege_id)
            return jsonify({"message": f"La empresa no existe."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/add_element", methods=["POST"])
def add_element():
    try:
        data = request.get_json()
        #name, price, description, category_id, discount, size, quantity = obtenerDatosProducto(data)
        product_data = schemas.ProductSchema(**data)
        global ruta_archivo_datos
        valor_salida = AddProduct(ruta_archivo_datos, product_data.product_id, product_data.name, product_data.category_id, product_data.description, product_data.price, product_data.discount, product_data.size, product_data.quantity) # 0 en caso de que haya salido bien y 1 en caso contrario
        if valor_salida == 1:
            return jsonify({"error": "Error al añadir el producto."}), 400
        return jsonify({"message": "Producto añadido correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/search_product')
def get_product():
    try:
        name = request.args.get('name')
        global ruta_archivo_datos
        products = buscarProducto(ruta_archivo_datos, name)
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=4000)
