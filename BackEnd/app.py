import sys
from functools import wraps

from flask import Flask, jsonify, request, session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# from sacarDatos import *
import schemas
from BackEnd.models import db
from BackEnd.models.Account import Account
from BackEnd.models.Category import Category
from BackEnd.models.Privilege import Privilege
from BackEnd.models.Product import Product
from BackEnd.routes.auth import auth_bp
from BackEnd.routes.register import registro_bp
from DB.funcionesProductos import *

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
ruta_base_datos = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../DB")
ruta_archivo_datos = os.path.join(ruta_base_datos, "DropHive" + ".db")

app = Flask(__name__)
app.secret_key = "tu_clave_secreta"
app.register_blueprint(auth_bp)
app.register_blueprint(registro_bp)
app.json.ensure_ascii = False


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user" not in session:
            return jsonify({"error": "No has iniciado sesión"}), 401
        return f(*args, **kwargs)

    return decorated_function


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


@app.route("/<string:dbname>/products")
@login_required
def get_products(dbname):
    try:
        return jsonify(get_all_values_from(Product, dbname)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /products: {e}")
        return jsonify({"error": "Error al obtener la lista de productos."}), 500


@app.route("/<string:dbname>/privileges")
@login_required
def get_privileges(dbname):
    try:
        return jsonify(get_all_values_from(Privilege, dbname)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /privileges: {e}")
        return jsonify({"error": "Error al obtener la lista de privilegios."}), 500


@app.route("/<string:dbname>/accounts")
@login_required
def get_accounts(dbname):
    try:
        return jsonify(get_all_values_from(Account, dbname)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /accounts: {e}")
        return jsonify({"error": "Error al obtener las cuentas."}), 500


@app.route("/<string:dbname>/category")
@login_required
def get_category(dbname):
    try:
        return jsonify(get_all_values_from(Category, dbname)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /category: {e}")
        return jsonify({"error": "Error al obtener las categorías."}), 500


def get_all_values_from(model, dbname):
    db_path = os.path.join(ruta_base_datos, dbname + ".db")
    engine = create_engine(f"sqlite:///{db_path}")
    Session = sessionmaker(bind=engine)
    with Session() as db_session:
        return [item.serialize() for item in db_session.query(model).all()]


@app.route("/add_product", methods=["POST"])
def add_product():
    try:
        data = request.get_json()
        #name, price, description, category_id, discount, size, quantity = obtenerDatosProducto(data)
        product_data = schemas.ProductSchema(**data)
        global ruta_archivo_datos
        valor_salida = AddProduct(ruta_archivo_datos, product_data.product_id, product_data.name,
                                  product_data.category_id, product_data.description, product_data.price,
                                  product_data.discount, product_data.size,
                                  product_data.quantity)  # 0 en caso de que haya salido bien y 1 en caso contrario
        if valor_salida == 1:
            return jsonify({"error": "Error al añadir el producto."}), 400
        return jsonify({"message": "Producto añadido correctamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/search_product')
def search_product():
    try:
        id_product = request.args.get('id')
        name = request.args.get('name')
        category_id = request.args.get('category_id')
        global ruta_archivo_datos
        if id_product:
            products = buscarProducto(ruta_archivo_datos, id_product=id_product)
        elif name:
            products = buscarProducto(ruta_archivo_datos, name=name)
        elif category_id:
            products = buscarProducto(ruta_archivo_datos, category_id=category_id)
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=4000)
