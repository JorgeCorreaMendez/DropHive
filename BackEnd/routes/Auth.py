import os
from functools import wraps

from flask import Blueprint
from flask import request, jsonify, session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from BackEnd.DB_utils import DB_PATH
from BackEnd.models.Account import Account

auth_bp = Blueprint("auth", __name__)


def get_session(db_name):
    db_path = os.path.join(DB_PATH, f"{db_name}.db")
    engine = create_engine(f"sqlite:///{db_path}")
    Session = sessionmaker(bind=engine)
    return Session()


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    mail = data.get("mail")
    password = data.get("password")
    db_name = str(mail).split("@")[1]
    db_session = get_session(db_name)

    try:
        account = db_session.query(Account).filter_by(mail=mail, password=password).first()
        if account:
            session["user"] = account.name
            return jsonify({"message": f"Bienvenido, {account.name}"}), 200
        else:
            return jsonify({"error": "Credenciales incorrectas"}), 401
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
            return jsonify({"error": "No has iniciado sesión"}), 401
        return f(*args, **kwargs)

    return decorated_function
