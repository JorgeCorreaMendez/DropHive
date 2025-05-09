import traceback

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
        print("Error, obteniendo las categorias")
        traceback.print_exc()
        return jsonify({"Error, obteniendo las categorias"}), 500


@categories_bp.route("/add_category", methods=["POST"])
@login_required
def add_category():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    if not name:
        print("Error, añadiendo la categoría")
        return jsonify({"error": "El nombre es obligatorio"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            new_category = Category(name=name, description=description)
            db.add(new_category)
            db.commit()
            return jsonify({"message": "Categoría creada exitosamente"}), 201
    except SQLAlchemyError:
        print("Error, añadiendo la categoría")
        traceback.print_exc()
        return jsonify({"error": "Error, añadiendo la categoría"}), 500


# TODO. cambiar rutas para modificar a PUT
@categories_bp.route("/modify_category", methods=["PUT"])
@login_required
def modify_category():
    data = request.get_json()
    category_id = data.get("id")
    name = data.get("name")
    description = data.get("description")
    if not category_id:
        print("El id es obligatorio")
        return jsonify({"error": "El id es obligatorio"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            category = db.query(Category).filter(Category.id == category_id).first()
            if not category:
                print("Categoría no encontrada")
                return jsonify({"error": "Categoría no encontrada"}), 404
            if name:
                category.name = name
            if description:
                category.description = description
            db.commit()
            return jsonify({"message": "Categoría actualizada exitosamente", "category": category.serialize()}), 200
    except SQLAlchemyError:
        print("Error, modificando la categoría")
        traceback.print_exc()
        return jsonify({"error": "Error, modificando la categoría"}), 500


@categories_bp.route("/delete_category", methods=["DELETE"])
@login_required
def delete_category():
    category_id = request.args.get("id")
    if not category_id:
        print("Error, el id es obligatorio")
        return jsonify({"error": "El id es obligatorio"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            category = db.query(Category).filter(Category.id == category_id).first()
            if not category:
                print("Error, categoría no encontrada")
                return jsonify({"error": "Categoría no encontrada"}), 404
            db.delete(category)
            db.commit()
            return jsonify({"message": "Categoría eliminada exitosamente"}), 200
    except SQLAlchemyError:
        print("Error, eliminando la categoría")
        traceback.print_exc()
        return jsonify({"error": "Error, eliminando la categoría"}), 500


# TODO. cambiar en el front
@categories_bp.route("/get_category", methods=["GET"])
@login_required
def search_category_by_id():
    category_id = request.args.get('id')
    if not category_id:
        print("Error, Se tiene que añadir un id")
        return jsonify({"error": "Se tiene que añadir un id"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            category = db.query(Category).filter(Category.id == category_id).first()
            if category is None:
                return jsonify({"message": "Categoría no encontrada"}), 404
            print(category.serialize())
            return jsonify(category.serialize()), 200
    except SQLAlchemyError:
        print("Error, al cambiar la contraseña")
        traceback.print_exc()
        return jsonify({"Error, al cambiar la contraseña"}), 500


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
        print("Error, filtrando la categoria")
        traceback.print_exc()
        return jsonify({"Error, filtrando la categoria"}), 500
