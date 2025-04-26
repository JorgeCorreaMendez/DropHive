from flask import Blueprint, jsonify, session, request

from BackEnd.models.Privilege import Privilege
from BackEnd.routes.Auth import login_required
from BackEnd.utils.sqlalchemy_methods import get_db_session
from BackEnd.services.models_service import get_all_values_from

privileges_bp = Blueprint("privileges", __name__)


@privileges_bp.route("/privileges")
@login_required
def get_privileges():
    exception = Exception
    try:
        return jsonify(get_all_values_from(Privilege, session["db.name"])), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except exception as e:
        return jsonify({"error": str(e)}), 500

@privileges_bp.route("/get_privilege")
@login_required
def search_privilege():
    category_id = request.args.get('id')
    if not category_id:
        return jsonify({"message": "Se tiene que añadir un id"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            category = db.query(Privilege).filter(Privilege.id == category_id).first()
            if category is None:
                return jsonify({"message": "Privilegio no encontrado"}), 404
            return jsonify(category.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500