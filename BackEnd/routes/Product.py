import traceback

from flask import request, jsonify, Blueprint, session
from sqlalchemy.exc import SQLAlchemyError

from BackEnd.models.Category import Category
from BackEnd.models.Product import Product
from BackEnd.models.Size import Size
from BackEnd.routes.Auth import login_required
from BackEnd.services.models_service import get_all_values_from, get_total_quantity_query
from BackEnd.utils.sqlalchemy_methods import get_db_session

products_bp = Blueprint("products", __name__)


@products_bp.route("/products", methods=["GET"])
@login_required
def get_products():
    try:
        return jsonify(get_all_values_from(Product, session["db.name"])), 200, {
            'Content-Type': 'application/json; charset=utf-8'}
    except SQLAlchemyError:
        print("Error, obteniendo los productos")
        traceback.print_exc()
        return jsonify({"error": "obteniendo los productos"}), 500


@products_bp.route("/add_product", methods=["POST"])
@login_required
def add_product():
    try:
        data = request.get_json()
        with get_db_session(session["db.name"]) as db_session:
            new_product = Product(
                id=data["id"],
                name=data["name"],
                category_id=data["category_id"],
                description=data["description"],
                price=data["price"],
                discount=data["discount"],
            )
            db_session.add(new_product)
            db_session.flush()
            if "sizes" in data:
                for size in data["sizes"]:
                    db_session.add(Size(
                        product_id=new_product.id,
                        name=size["name"],
                        quantity=size["quantity"]
                    ))
            db_session.commit()
        return jsonify({"message": "Producto añadido correctamente"}), 201
    except SQLAlchemyError:
        print("Error, añadiendo un nuevo producto")
        traceback.print_exc()
        return jsonify({"error": "añadiendo un nuevo producto"}), 500


@products_bp.route("/modify_product", methods=["POST"])
@login_required
def modify_product():
    try:
        id_product = request.args.get('id')
        data = request.get_json()
        with get_db_session(session["db.name"]) as db_session:
            product = db_session.query(Product).filter_by(id=id_product).first()
            if not product:
                print("Error, producto no encontrado")
                return jsonify({"error": "Producto no encontrado"}), 404
            if "name" in data:
                product.name = data["name"]
            if "category_id" in data:
                product.category_id = data["category_id"]
            if "description" in data:
                product.description = data["description"]
            if "price" in data:
                product.price = data["price"]
            if "discount" in data:
                product.discount = data["discount"]
            db_session.commit()
        return jsonify({"message": "Producto modificado correctamente"}), 200
    except SQLAlchemyError:
        print("Error, modificando productos")
        traceback.print_exc()
        return jsonify({"error": "modificando productos"}), 500


@products_bp.route("/delete_product", methods=["DELETE"])
@login_required
def delete_product():
    try:
        id_product = request.args.get('id')
        with get_db_session(session["db.name"]) as db_session:
            product = db_session.query(Product).filter_by(id=id_product).first()
            if not product:
                print("Error, producto no encontrado")
                return jsonify({"error": "Producto no encontrado"}), 404
            db_session.delete(product)
            db_session.commit()
        return jsonify({"message": "Producto eliminado correctamente"}), 200
    except SQLAlchemyError:
        print("Error, eliminando el producto")
        traceback.print_exc()
        return jsonify({"error": "eliminando el producto"}), 500


# TODO. cambiar ruta en front
# TODO. crear servicio para filtrar por ID
@products_bp.route('/filter_product_by_id', methods=["GET"])
@login_required
def search_product_by_id():
    try:
        id_product = request.args.get('id')
        with get_db_session(session["db.name"]) as db_session:
            products = db_session.query(Product).filter(id_product == Product.id).all()
            if products:
                return jsonify([product.serialize() for product in products]), 200
            else:
                return jsonify({"message": "No se encontraron productos con ese ID."}), 404
    except SQLAlchemyError:
        print("Error, buscando el producto")
        traceback.print_exc()
        return jsonify({"error": "buscando el producto"}), 500


# TODO: Cambiar category_id en la DB
@products_bp.route('/filter_products', methods=["GET"])
@login_required
def filter_products():
    try:
        category_name = request.args.get('category')
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        max_quantity = request.args.get('max_quantity')
        limit = int(request.args.get('limit', 5))
        offset = int(request.args.get('offset', 0))
        with (get_db_session(session["db.name"]) as db_session):
            query = db_session.query(Product).join(Category)
            if category_name:
                query = query.filter(Category.name == category_name)
            if min_price:
                query = query.filter(Product.price >= float(min_price))
            if max_price:
                query = query.filter(Product.price <= float(max_price))
            if max_quantity:
                query_quantity = get_total_quantity_query(db_session)
                query = query.join(query_quantity, Product.id == query_quantity.c.id)
                query = query.filter(query_quantity.c.quantity <= int(max_quantity))
            query = query.limit(limit).offset(offset)
            print([product.serialize() for product in query.all()])
            return jsonify([product.serialize() for product in query.all()]), 200
    except SQLAlchemyError:
        print("Error, filtrando los productos")
        traceback.print_exc()
        return jsonify({"error": "filtrando los productos"}), 500

from sqlalchemy import or_

@products_bp.route('/similar_products/<string:product_id>', methods=["GET"])
@login_required
def get_similar_products(product_id):
    try:
        with get_db_session(session["db.name"]) as db_session:
            original = db_session.query(Product).get(product_id)
            if not original:
                return jsonify({"error": "Producto no encontrado"}), 404

            print(original)
            # Dividir el nombre original en palabras clave
            search_terms = original.name.split()
            name_filters = [Product.name.ilike(f"%{term}%") for term in search_terms]

            # Buscar productos similares
            similares = (
                db_session.query(Product)
                .filter(Product.id != product_id)
                .filter(Product.category_id == original.category_id)
                .limit(10)
                .all()
            )

            print("Similares encontrados:", [p.name for p in similares])

            return jsonify([p.serialize() for p in similares]), 200

    except SQLAlchemyError:
        traceback.print_exc()
        return jsonify({"error": "Error buscando productos similares"}), 500

