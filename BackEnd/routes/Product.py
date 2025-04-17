from flask import request, jsonify, Blueprint

from BackEnd import schemas
from BackEnd.models.Product import Product
from BackEnd.models.Category import Category
from BackEnd.routes.Auth import login_required
from BackEnd.utils.sqlalchemy_methods import get_all_values_from, get_db_session

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


# TODO: Cambiar category_id en la DB
@products_bp.route('/<string:dbname>/filter_products')
@login_required
def filter_products(dbname):
    try:
        category_name = request.args.get('category')
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        max_quantity = request.args.get('max_quantity')
        limit = int(request.args.get('limit', 5))
        offset = int(request.args.get('offset', 0))
        with get_db_session(dbname) as db_session:
            query = db_session.query(Product).join(Category)
            if category_name:
                query = query.filter(Category.name == category_name)
            if category_name:
                query = query.filter(Category.name == category_name)
            if min_price:
                query = query.filter(Product.price >= float(min_price))
            if max_price:
                query = query.filter(Product.price <= float(max_price))
            if max_quantity:
                query = query.filter(Product.quantity <= int(max_quantity))
            query = query.limit(limit).offset(offset)
            return jsonify([product.serialize() for product in query.all()]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
