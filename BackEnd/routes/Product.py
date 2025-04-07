import os

from flask import request, jsonify, Blueprint
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from BackEnd import schemas
from BackEnd.utils.sqlalchemy_methods import get_all_values_from, DB_PATH
from BackEnd.models.Product import Product
from BackEnd.routes.Auth import login_required

products_bp = Blueprint("products", __name__)


@products_bp.route("/<string:dbname>/products")
@login_required
def get_products(dbname):
    try:
        return jsonify(get_all_values_from(Product, dbname)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /products: {e}")
        return jsonify({"error": "Error al obtener la lista de productos."}), 500


@products_bp.route("/<string:dbname>/add_product", methods=["POST"])
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


@products_bp.route('/<string:dbname>/search_product')
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
