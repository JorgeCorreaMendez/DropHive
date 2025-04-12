import os
from functools import wraps

from flask import request, jsonify, session, Blueprint, redirect, url_for
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from BackEnd.utils.sqlalchemy_methods import DB_PATH
from BackEnd.models.Account import Account
from BackEnd.utils.bcrypt_methods import verify_hash

from DB.CreacionBaseDatosCuentas import search_cuenta

auth_bp = Blueprint("auth", __name__)


def get_session(db_name):
    db_path = os.path.join(DB_PATH, f"{db_name}.db")
    if not os.path.exists(db_path):
        return None
    engine = create_engine(f"sqlite:///{db_path}")
    Session = sessionmaker(bind=engine)
    return Session()


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    mail = data.get("mail")
    password = data.get("password")
    db_name = search_cuenta(mail)
    if not db_name:
        return jsonify({"message": "No se encontrado"})
    print("La base de datos es:", db_name)
    db_session = get_session(db_name)

    if not mail or not password:
        return jsonify({"message": "Correo y contraseña son requeridos."}), 400

    if db_session is None:
        return jsonify({"message": f"No se encontró la base de datos para {db_name}"}), 401

    try:
        account = db_session.query(Account).filter_by(mail=mail).first()
        if account:
            if verify_hash(password, account.password):
                session["user"] = account.name
                return jsonify({"message": f"Bienvenido, {account.name}", "db_name": f"{db_name}"}), 200
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
