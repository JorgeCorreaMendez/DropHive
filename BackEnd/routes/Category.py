import os

from flask import Blueprint, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from BackEnd.models.Category import Category
from BackEnd.routes.Auth import login_required
from BackEnd.utils.sqlalchemy_methods import get_all_values_from, DB_PATH

categories_bp = Blueprint("categories_bp", __name__)


@categories_bp.route("/<string:dbname>/categories")
@login_required
def get_category(dbname):
    try:
        return jsonify(get_all_values_from(Category, dbname)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /category: {e}")
        return jsonify({"error": "Error al obtener las categorías."}), 500


@categories_bp.route("/<string:db_name>/get_category/<string:category_id>")
@login_required
def search_category(db_name, category_id):
    if not category_id:
        return jsonify({"message": "Se tiene que añadir un id"}), 400

    try:
        db_path = os.path.join(DB_PATH, f"{db_name}.db")
        engine = create_engine(f"sqlite:///{db_path}")
        Session = sessionmaker(bind=engine)

        with Session() as db_session:
            category = db_session.query(Category).filter(Category.id == category_id).first()

            if category is None:
                return jsonify({"message": "Categoría no encontrada"}), 404

            return jsonify(category.serialize()), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Error interno del servidor"}), 500
