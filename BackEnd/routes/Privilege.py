import traceback

from flask import Blueprint, jsonify, session, request
from sqlalchemy.exc import SQLAlchemyError

from BackEnd.models.Privilege import Privilege
from BackEnd.routes.Auth import login_required
from BackEnd.utils.sqlalchemy_methods import get_db_session
from BackEnd.services.models_service import get_all_values_from
from BackEnd.utils.logger import logger

privileges_bp = Blueprint("privileges", __name__)


@privileges_bp.route("/privileges", methods=["GET"])
@login_required
def get_privileges():
    try:
        return jsonify(get_all_values_from(Privilege, session["db.name"])), 200, {
            'Content-Type': 'application/json; charset=utf-8'}
    except SQLAlchemyError:
        logger.error("An error occurred while retrieving privileges")
        traceback.print_exc()
        return jsonify({"error": "Error retrieving privileges"}), 500


# TODO: update route in frontend
@privileges_bp.route("/get_privilege", methods=["GET"])
@login_required
def search_privilege_by_id():
    privilege_id = request.args.get('id')
    if not privilege_id:
        return jsonify({"error": "Privilege ID is required"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            category = db.query(Privilege).filter(Privilege.id == privilege_id).first()
            if category is None:
                return jsonify({"message": "Privilege not found"}), 404
            return jsonify(category.serialize()), 200
    except SQLAlchemyError:
        logger.error("An error occurred while searching for the privilege")
        traceback.print_exc()
        return jsonify({"error": "Error retrieving the privilege"}), 500
