from functools import wraps

from flask import request, jsonify, session, Blueprint, redirect, url_for

from BackEnd.models.Account import Account
from BackEnd.models.User import User
from BackEnd.utils.bcrypt_methods import verify_hash
from BackEnd.utils.sqlalchemy_methods import get_db_session

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    mail = data.get("mail")
    password = data.get("password")

    if not mail or not password:
        return jsonify({"message": "Correo y contraseña son requeridos."}), 400
    try:
        with get_db_session("Users") as db_session:
            user = db_session.query(User).filter_by(mail=mail).first()
        if not user:
            return jsonify({"message": "No existe esa cuenta."}), 400

        account = get_db_session(user.db_name).query(Account).filter_by(mail=mail).first()
        if account:
            if verify_hash(password, account.password):
                session["user"] = account.name
                return jsonify({"message": f"Bienvenido, {account.name}", "db_name": f"{user.db_name}"}), 200
            else:
                return jsonify({"message": "Credenciales incorrectas"}), 401
        else:
            return jsonify({"message": "Credenciales incorrectas"}), 401
    finally:
        db_session.close()


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
