from flask import jsonify, Blueprint, request, session

from BackEnd.models.Account import Account
from BackEnd.routes.Auth import login_required
from BackEnd.utils.bcrypt_methods import create_hash
from BackEnd.utils.sqlalchemy_methods import get_all_values_from, get_db_session

from DB.CreacionBaseDatosCuentas import search_cuenta

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
    email = data.get("mail")
    new_password = data.get("password")
    db_name = data.get("db_name")
    try:
        with get_db_session(db_name) as db:
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
def comprobar_codigo_verificacion():
    data = request.get_json()
    print(data)
    if session["verification_code"] == data.get("code"):
        # Si el código es correcto, devolver un 200 OK
        print("Se ha enviado el codigo correcto")
        return jsonify({}), 200  # Respuesta vacía con código de estado 200
    else:
        # Si el código es incorrecto, devolver un 400 Bad Request
        return jsonify({}), 400  # Respuesta vacía con código de estado 400


@accounts_bp.route("/check_mail/<string:email>")
def check_mail(email):
    existe = search_cuenta(email)
    if existe is not None:
        print(existe)
        return jsonify({"dbname": existe}), 200  # 200 OK, sin cuerpo en la respuesta
    else:
        return jsonify({"error": "Email already exists"}), 400  # 400 Bad Request

