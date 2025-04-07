from flask import Blueprint, jsonify

from BackEnd.utils.sqlalchemy_methods import get_all_values_from
from BackEnd.models.Category import Category
from BackEnd.routes.Auth import login_required

categories_bp = Blueprint("categories_bp", __name__)


@categories_bp.route("/<string:dbname>/categories")
@login_required
def get_category(dbname):
    try:
        return jsonify(get_all_values_from(Category, dbname)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /category: {e}")
        return jsonify({"error": "Error al obtener las categorías."}), 500
