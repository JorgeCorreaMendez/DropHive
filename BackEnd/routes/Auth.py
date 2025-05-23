import traceback
from functools import wraps

from flask import request, jsonify, session, Blueprint, redirect, url_for

from BackEnd.models.Account import Account
from BackEnd.models.User import User
from BackEnd.services.user_service import get_user_by
from BackEnd.utils.bcrypt_methods import verify_hash
from BackEnd.utils.sqlalchemy_methods import get_db_session

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        mail = data.get("mail")
        password = data.get("password")
        if not mail or not password:
            print("Error, correo y contraseña son requeridos")
            return jsonify({"error": "Correo y contraseña son requeridos."}), 400
        user = get_user_by(mail)
        if not user:
            print("Error, No existe la cuenta")
            return jsonify({"error": "No existe la cuenta."}), 400
        with get_db_session(user.db_name) as account_session:
            account = account_session.query(Account).filter_by(mail=mail).first()
            if not verify_hash(password, account.password):
                print("Error, Credenciales incorrectas")
                return jsonify({"error": "Credenciales incorrectas"}), 401
            session["user"] = account.name
            session["db.name"] = user.db_name
            return jsonify({
                "message": f"Bienvenido, {account.name}",
                "db_name": f"{user.db_name}"
            }), 200
    except Exception as e:
        print("Ocurrio un error registrando la empresa: ")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/logout", methods=["GET"])
def logout():
    session.pop("user", None)
    return jsonify({"message": "Sesión cerrada correctamente"}), 200


# TODO.
@auth_bp.route("/aceptar_primer_login", methods=["POST"])
def modificar_registro():
    mail = request.args.get("mail")
    try:
        with get_db_session("Users") as user_session:
            user = user_session.query(User).filter_by(mail=mail).first()
            user.first_login = False
            user_session.commit()
        return jsonify({"message": "Cambio de contraseña aceptado."}), 200
    except Exception as e:
        print("Ocurrio un error acceptando el primer acceso: ")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


def login_required(route_function):
    @wraps(route_function)
    def decorated_function(*args, **kwargs):
        if "user" not in session:
            return redirect(url_for("pages.login"))
        return route_function(*args, **kwargs)

    return decorated_function
