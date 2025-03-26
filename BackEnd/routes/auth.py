import os
from functools import wraps

from flask import Blueprint, session, jsonify
from flask import request, jsonify, session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from BackEnd.models.Account import Account

auth_bp = Blueprint("auth", __name__)


def get_db_path(username):
    return os.path.join(os.path.abspath(os.path.dirname(__file__)), "../../DB", f"{username}.db")


def get_user_session(db_path):
    engine = create_engine(f"sqlite:///{db_path}")
    Session = sessionmaker(bind=engine)
    return Session()


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    DB_PATH = get_db_path(username)
    db_session = get_user_session(DB_PATH)

    try:
        account = db_session.query(Account).filter_by(name=username, password=password).first()
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
