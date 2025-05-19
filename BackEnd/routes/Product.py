import traceback

from flask import request, jsonify, Blueprint, session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_

from BackEnd.models.Company import Company
from BackEnd.utils.logger import logger
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
        logger.error("An error occurred while retrieving products")
        traceback.print_exc()
        return jsonify({"error": "obteniendo los productos"}), 500


@products_bp.route("/add_product", methods=["POST"])
@login_required
def add_product():
    try:
        data = request.get_json()
        with get_db_session(session["db.name"]) as db_session:
            if db_session.query(Product).filter_by(id=data["id"]).first():
                return jsonify({"error": "Product with that ID already exists"}), 409
            category = db_session.query(Category).filter_by(id=data["category"]["id"]).first()
            company = db_session.query(Company).filter_by(id=data["company"]["id"]).first()
            if not category:
                category = Category(name=data["category"]["name"])
                db_session.add(category)
                db_session.flush()
            new_product = Product(
                id=data["id"],
                name=data["name"],
                category_id=category.id,
                description=data["description"],
                price=data["price"],
                discount=data["discount"],
                company_id=company
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
            if "secondary_categories" in data:
                secondary_categories = []
                for name in data["secondary_categories"]:
                    cat = db_session.query(Category).filter_by(name=name).first()
                    if cat:
                        secondary_categories.append(cat)
                new_product.secondary_categories = secondary_categories
            db_session.commit()
            logger.info(f"Product '{data['name']}' created")
        return jsonify({"message": "Product successfully added"}), 201
    except SQLAlchemyError:
        logger.error("An error occurred while adding a new product")
        traceback.print_exc()
        return jsonify({"error": "Error adding new product"}), 500


@products_bp.route("/modify_product", methods=["PUT"])
@login_required
def modify_product():
    try:
        product_id = request.args.get("id")
        data = request.get_json()
        db_session = get_db_session(session["db.name"])
        product = db_session.query(Product).filter_by(id=product_id).first()
        if not product:
            return jsonify({"error": "Product not found"}), 404
        if "name" in data:
            product.name = data["name"]
        if "description" in data:
            product. description = data["description"]
        if "price" in data:
            product.price = data["price"]
        if "discount" in data:
            product.discount = data["discount"]
        if data.get("category", {}).get("name"):
            category_name = data["category"]["name"]
            category = db_session.query(Category).filter_by(name=category_name).first()
            if not category:
                category = Category(name=category_name)
                db_session.add(category)
                db_session.flush()
            product.category_id = category.id
        if "sizes" in data:
            db_session.query(Size).filter_by(product_id=product.id).delete()
            for sz in data["sizes"]:
                db_session.add(Size(
                    product_id=product.id,
                    name=sz["name"],
                    quantity=sz["quantity"]
                ))
        db_session.commit()
        logger.info(f"Product '{product.name}' modified.")
        return jsonify({"message": "Product successfully modified"}), 200
    except SQLAlchemyError:
        logger.error("An error occurred while modifying the product")
        traceback.print_exc()
        return jsonify({"error": "Error modifying product"}), 500


@products_bp.route("/delete_product", methods=["DELETE"])
@login_required
def delete_product():
    try:
        id_product = request.args.get('id')
        logger.info(f"Attempting to delete product with ID: {id_product}")
        with get_db_session(session["db.name"]) as db_session:
            product = db_session.query(Product).filter_by(id=id_product).first()
            if not product:
                logger.error(f"Product not found with ID: {id_product}")
                return jsonify({"error": "Product not found"}), 404
            db_session.delete(product)
            db_session.commit()
            logger.info(f"Product '{product.name}' deleted")
        return jsonify({"message": "Product successfully deleted"}), 200
    except SQLAlchemyError:
        logger.error(f"An error occurred while deleting product")
        traceback.print_exc()
        return jsonify({"error": "Error deleting product"}), 500


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
                return jsonify({"message": "No products found with that ID."}), 404
    except SQLAlchemyError:
        logger.error("An error occurred while searching product by ID")
        traceback.print_exc()
        return jsonify({"error": "Error searching for product"}), 500


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
            total = db_session.query(Product).count()
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
            return jsonify({"productos": [product.serialize() for product in query.all()], "total": total}), 200
    except SQLAlchemyError:
        logger.error("An error occurred while filtering products")
        traceback.print_exc()
        return jsonify({"error": "Error filtering products"}), 500


@products_bp.route('/similar_products', methods=["GET"])
@login_required
def get_similar_products():
    product_id = request.args.get("id")
    try:
        with get_db_session(session["db.name"]) as db_session:
            original = db_session.query(Product).get(product_id)
            if not original:
                return jsonify({"error": "Product not found"}), 404
            search_terms = original.name.split()
            name_filters = [Product.name.ilike(f"%{term}%") for term in search_terms]
            similar = (
                db_session.query(Product)
                .filter(Product.id != product_id)
                .filter(Product.category_id == original.category_id)
                .filter(or_(*name_filters))
                .limit(5)
                .all()
            )
            return jsonify([p.serialize() for p in similar]), 200
    except SQLAlchemyError:
        logger.error("An error occurred while retrieving similar products")
        traceback.print_exc()
        return jsonify({"error": "Error retrieving similar products"}), 500
