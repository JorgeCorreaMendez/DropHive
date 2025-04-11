from flask import Blueprint, jsonify

from BackEnd.utils.sqlalchemy_methods import get_all_values_from
from BackEnd.models.Privilege import Privilege
from BackEnd.routes.Auth import login_required

privileges_bp = Blueprint("privileges", __name__)


@privileges_bp.route("/<string:dbname>/privileges")
@login_required
def get_privileges(dbname):
    try:
        return jsonify(get_all_values_from(Privilege, dbname)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /privileges: {e}")
        return jsonify({"error": "Error al obtener la lista de privilegios."}), 500
