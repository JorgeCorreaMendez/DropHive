from flask import Blueprint, jsonify, session, request

from BackEnd.models.Category import Category
from BackEnd.routes.Auth import login_required
from BackEnd.utils.sqlalchemy_methods import get_db_session
from BackEnd.services.models_service import get_all_values_from

categories_bp = Blueprint("categories_bp", __name__)


@categories_bp.route("/categories")
@login_required
def get_category():
    try:
        return jsonify(get_all_values_from(Category, session["db.name"])), 200, {
            'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@categories_bp.route("/get_category")
@login_required
def search_category():
    category_id = request.args.get('id')
    if not category_id:
        return jsonify({"message": "Se tiene que añadir un id"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            category = db.query(Category).filter(Category.id == category_id).first()
            if category is None:
                return jsonify({"message": "Categoría no encontrada"}), 404
            return jsonify(category.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@categories_bp.route('/filter_category')
@login_required
def filter_category():
    try:
        limit = int(request.args.get('limit', 5))
        offset = int(request.args.get('offset', 0))
        with (get_db_session(session["db.name"]) as db_session):
            query = db_session.query(Category)
            query = query.limit(limit).offset(offset)
            print([product.serialize() for product in query.all()])
            return jsonify([product.serialize() for product in query.all()]), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
