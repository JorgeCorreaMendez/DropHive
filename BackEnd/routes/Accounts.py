from flask import jsonify, Blueprint, request, session

from BackEnd.models.Account import Account
from BackEnd.routes.Auth import login_required
from BackEnd.services.user_service import get_user_by
from BackEnd.utils.bcrypt_methods import create_hash
from BackEnd.utils.sqlalchemy_methods import get_db_session
from BackEnd.services.models_service import get_all_values_from

accounts_bp = Blueprint("accounts", __name__)


@accounts_bp.route("/<string:dbname>/accounts")
@login_required
def get_accounts(dbname):
    try:
        return jsonify(get_all_values_from(Account, dbname)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /accounts: {e}")
        return jsonify({"error": "Error al obtener las cuentas."}), 500


@accounts_bp.route("/change_password", methods=["POST"])
def change_password():
    if "verification_code" not in session:
        return jsonify({"error": "Código de verificación no encontrado o expirado."}), 400
    data = request.get_json()
    email = data.get("mail")
    new_password = data.get("password")
    try:
        with get_db_session(get_user_by(email).db_name) as db:
            account = db.query(Account).filter_by(mail=email).first()
            if account:
                account.password = create_hash(new_password)
                db.commit()
                session.pop("verification_code")
                return jsonify({"message": "Contraseña actualizada correctamente."}), 200
            else:
                return jsonify({"error": "Correo electrónico no encontrado."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@accounts_bp.route("/check_verification_code", methods=["POST"])
def check_verification_code():
    if session["verification_code"] == request.get_json().get("code"):
        return jsonify({}), 200
    else:
        return jsonify({}), 400


@accounts_bp.route("/check_mail/<string:mail>")
def check_mail(mail):
    try:
        user = get_user_by(mail)
        if user:
            return jsonify({"dbname": user.db_name}), 200
        else:
            return jsonify({"Error": "Correo no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
