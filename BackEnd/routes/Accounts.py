from flask import jsonify, Blueprint

from BackEnd.utils.DB_utils import get_all_values_from
from BackEnd.models.Account import Account
from BackEnd.routes.Auth import login_required

accounts_bp = Blueprint("accounts", __name__)


@accounts_bp.route("/<string:dbname>/accounts")
@login_required
def get_accounts(dbname):
    try:
        return jsonify(get_all_values_from(Account, dbname)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /accounts: {e}")
        return jsonify({"error": "Error al obtener las cuentas."}), 500
