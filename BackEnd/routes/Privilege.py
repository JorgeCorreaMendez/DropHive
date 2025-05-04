import traceback

from flask import Blueprint, jsonify, session, request
from sqlalchemy.exc import SQLAlchemyError

from BackEnd.models.Privilege import Privilege
from BackEnd.routes.Auth import login_required
from BackEnd.utils.sqlalchemy_methods import get_db_session
from BackEnd.services.models_service import get_all_values_from

privileges_bp = Blueprint("privileges", __name__)


@privileges_bp.route("/privileges", methods=["GET"])
@login_required
def get_privileges():
    try:
        return jsonify(get_all_values_from(Privilege, session["db.name"])), 200, {
            'Content-Type': 'application/json; charset=utf-8'}
    except SQLAlchemyError:
        print("Error, obteniendo los privilegios")
        traceback.print_exc()
        return jsonify({"error": "obteniendo los privilegios"}), 500


# TODO. cambiar ruta en front
@privileges_bp.route("/get_privilege", methods=["GET"])
@login_required
def search_privilege_by_id():
    category_id = request.args.get('id')
    if not category_id:
        print("Error, Se tiene que añadir un id")
        return jsonify({"error": "Se tiene que añadir un id"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            category = db.query(Privilege).filter(Privilege.id == category_id).first()
            if category is None:
                return jsonify({"message": "Privilegio no encontrado"}), 404
            return jsonify(category.serialize()), 200
    except SQLAlchemyError:
        print("Error, buscando el privilegio")
        traceback.print_exc()
        return jsonify({"error": "buscando el privilegio"}), 500
