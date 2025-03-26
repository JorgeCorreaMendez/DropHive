import os

from flask import Flask, jsonify, request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import schemas
from BackEnd.models.Account import Account
from BackEnd.models.Category import Category
from BackEnd.models.Privilege import Privilege
from BackEnd.models.Product import Product
from BackEnd.routes.auth import auth_bp, login_required
from BackEnd.routes.register import registro_bp

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../DB")

app = Flask(__name__)
app.secret_key = "tu_clave_secreta"
app.register_blueprint(auth_bp)
app.register_blueprint(registro_bp)
app.json.ensure_ascii = False


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
    db_path = os.path.join(DB_PATH, dbname + ".db")
    engine = create_engine(f"sqlite:///{db_path}")
    Session = sessionmaker(bind=engine)
    with Session() as db_session:
        return [item.serialize() for item in db_session.query(model).all()]


@app.route("/<string:dbname>/add_product", methods=["POST"])
@login_required
def add_product(dbname):
    try:
        data = request.get_json()
        product_data = schemas.ProductSchema(**data)
        db_path = os.path.join(DB_PATH, f"{dbname}.db")
        engine = create_engine(f"sqlite:///{db_path}")
        Session = sessionmaker(bind=engine)
        with Session() as db_session:
            new_product = Product(
                product_id=product_data.product_id,
                name=product_data.name,
                category_id=product_data.category_id,
                description=product_data.description,
                price=product_data.price,
                discount=product_data.discount,
                size=product_data.size,
                quantity=product_data.quantity
            )
            db_session.add(new_product)
            db_session.commit()
        return jsonify({"message": "Producto añadido correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/<string:dbname>/search_product')
@login_required
def search_product(dbname):
    try:
        id_product = request.args.get('id')
        name = request.args.get('name')
        category_id = request.args.get('category_id')

        db_path = os.path.join(DB_PATH, f"{dbname}.db")
        engine = create_engine(f"sqlite:///{db_path}")
        Session = sessionmaker(bind=engine)
        with Session() as db_session:
            query = db_session.query(Product)
            if id_product:
                query = query.filter(id_product == Product.product_id)
            if name:
                query = query.filter(Product.name.ilike(f"%{name}%"))
            if category_id:
                query = query.filter(int(category_id) == Product.category_id)

            return jsonify([product.serialize() for product in query.all()]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=4000)
