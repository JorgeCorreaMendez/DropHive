import traceback
from BackEnd.utils.logger import logger

from flask import Blueprint, jsonify, session, request
from sqlalchemy.exc import SQLAlchemyError

from BackEnd.models.Category import Category
from BackEnd.routes.Auth import login_required
from BackEnd.utils.sqlalchemy_methods import get_db_session
from BackEnd.services.models_service import get_all_values_from

categories_bp = Blueprint("categories_bp", __name__)


@categories_bp.route("/categories", methods=["GET"])
@login_required
def get_categories():
    try:
        return jsonify(get_all_values_from(Category, session["db.name"])), 200, {
            'Content-Type': 'application/json; charset=utf-8'}
    except SQLAlchemyError:
        logger.error("An error occurred while retrieving categories")
        traceback.print_exc()
        return jsonify({"error": "Error retrieving categories"}), 500


@categories_bp.route("/add_category", methods=["POST"])
@login_required
def add_category():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    if not name:
        return jsonify({"error": "Name is required"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            new_category = Category(name=name, description=description)
            db.add(new_category)
            db.commit()
            logger.info(f"Category '{name}' created.")
            return jsonify({"message": "Category created successfully"}), 201
    except SQLAlchemyError:
        logger.error("An error occurred while adding the category")
        traceback.print_exc()
        return jsonify({"error": "Error adding category"}), 500


@categories_bp.route("/modify_category", methods=["PUT"])
@login_required
def modify_category():
    data = request.get_json()
    category_id = data.get("id")
    if not category_id:
        return jsonify({"error": "ID is required"}), 400
    try:
        name = data.get("name")
        description = data.get("description")
        with get_db_session(session["db.name"]) as db:
            category = db.query(Category).filter(Category.id == category_id).first()
            if not category:
                return jsonify({"error": "Category not found"}), 404
            if name:
                category.name = name
            if description:
                category.description = description
            db.commit()
            logger.info(f"Category '{category.name}' updated.")
            return jsonify({"message": "Category updated successfully", "category": category.name}), 200
    except SQLAlchemyError:
        logger.error("An error occurred while modifying the category")
        traceback.print_exc()
        return jsonify({"error": "Error updating category"}), 500


@categories_bp.route("/delete_category", methods=["DELETE"])
@login_required
def delete_category():
    category_id = request.args.get("id")
    if not category_id:
        return jsonify({"error": "ID is required"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            category = db.query(Category).filter(Category.id == category_id).first()
            if not category:
                return jsonify({"error": "Category not found"}), 404
            db.delete(category)
            db.commit()
            logger.info(f"Category '{category.name}' deleted.")
            return jsonify({"message": "Category deleted successfully"}), 200
    except SQLAlchemyError:
        logger.error("An error occurred while deleting the category")
        traceback.print_exc()
        return jsonify({"error": "Error deleting category"}), 500


# TODO. cambiar ruta en el front
@categories_bp.route("/get_category", methods=["GET"])
@login_required
def search_category_by_id():
    category_id = request.args.get('id')
    if not category_id:
        return jsonify({"error": "ID is required"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            category = db.query(Category).filter(Category.id == category_id).first()
            if category is None:
                return jsonify({"error": "Category not found"}), 404
            logger.info(f"Category retrieved successfully: {category.name}")
            return jsonify(category.serialize()), 200
    except SQLAlchemyError:
        logger.error("An error occurred while retrieving category by ID")
        traceback.print_exc()
        return jsonify({"error": "Error retrieving category by ID"}), 500


@categories_bp.route('/filter_category', methods=["GET"])
@login_required
def filter_category():
    try:
        limit = int(request.args.get('limit', 5))
        offset = int(request.args.get('offset', 0))
        with (get_db_session(session["db.name"]) as db_session):
            query = db_session.query(Category)
            query = query.limit(limit).offset(offset)
            return jsonify([product.serialize() for product in query.all()]), 200
    except SQLAlchemyError:
        logger.error("An error occurred while filtering categories")
        traceback.print_exc()
        return jsonify({"error": "Error filtering categories"}), 500
