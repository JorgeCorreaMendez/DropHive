import os

from flask import request, jsonify, Blueprint
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from BackEnd import schemas
from BackEnd.utils.sqlalchemy_methods import get_all_values_from, DB_PATH, get_db_session
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
        with get_db_session(dbname) as db_session:
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


@products_bp.route('/<string:dbname>/filter_product_by_id')
@login_required
def search_product_by_id(dbname):
    try:
        id_product = request.args.get('id')
        with get_db_session(dbname) as db_session:
            products = db_session.query(Product).filter(id_product == Product.product_id).all()
            if products:
                return jsonify([product.serialize() for product in products]), 200
            else:
                return jsonify({"message": "No se encontraron productos con ese ID."}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@products_bp.route('/<string:dbname>/filter_product_by_category')
@login_required
def filter_by_category(dbname):
    try:
        category_id = request.args.get('category_id')
        db_path = os.path.join(DB_PATH, f"{dbname}.db")
        engine = create_engine(f"sqlite:///{db_path}")
        Session = sessionmaker(bind=engine)
        with Session() as db_session:
            query = db_session.query(Product)
            if category_id:
                query = query.filter(int(category_id) == Product.category_id)
            return jsonify([product.serialize() for product in query.all()]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
