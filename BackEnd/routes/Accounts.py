from flask import jsonify, Blueprint, request, session

from BackEnd.models.Account import Account
from BackEnd.routes.Auth import login_required
from BackEnd.utils.bcrypt_methods import create_hash
from BackEnd.utils.sqlalchemy_methods import get_all_values_from, get_db_session

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
    data = request.get_json()
    if "verification_code" not in session:
        return jsonify({"error": "Código de verificación no encontrado o expirado."}), 400
    if session["verification_code"] == data.get("code"):
        email = data.get("mail")
        new_password = data.get("password")
        try:
            # TODO se tiene que saber la empresa
            with get_db_session("DropHive") as db:
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
    else:
        return jsonify({"error": "El código de validación no es correcto"}), 400
