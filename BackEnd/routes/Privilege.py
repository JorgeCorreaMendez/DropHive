from flask import Blueprint, jsonify, session

from BackEnd.services.models_service import get_all_values_from
from BackEnd.models.Privilege import Privilege
from BackEnd.routes.Auth import login_required

privileges_bp = Blueprint("privileges", __name__)


@privileges_bp.route("/privileges")
@login_required
def get_privileges():
    exception = Exception
    try:
        return jsonify(get_all_values_from(Privilege, session["db.name"])), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except exception as e:
        return jsonify({"error": str(e)}), 500
