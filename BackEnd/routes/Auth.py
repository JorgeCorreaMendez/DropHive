from functools import wraps

from flask import request, jsonify, session, Blueprint, redirect, url_for

from BackEnd.models.Account import Account
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
            return jsonify({"message": "Correo y contraseña son requeridos."}), 400
        user = get_user_by(mail)
        if not user:
            return jsonify({"message": "No existe esa cuenta."}), 400
        with get_db_session(user.db_name) as account_session:
            account = account_session.query(Account).filter_by(mail=mail).first()
            if not verify_hash(password, account.password):
                return jsonify({"message": "Credenciales incorrectas"}), 401
            session["user"] = account.name
            return jsonify({
                "message": f"Bienvenido, {account.name}",
                "db_name": f"{user.db_name}"
            }), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/logout", methods=["GET"])
def logout():
    session.pop("user", None)
    return jsonify({"message": "Sesión cerrada correctamente"}), 200


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)

    return decorated_function
