import os

from flask import Blueprint
from flask import request, jsonify, session, g
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
    mail = data.get("mail")
    password = data.get("password")

    DB_PATH = get_db_path(username)
    db_session = get_user_session(DB_PATH)

    try:
        account = db_session.query(Account).filter_by(mail=mail, password=password).first()
        if account:
            session["user"] = account.name
            session["db_path"] = DB_PATH
            return jsonify({"message": f"Bienvenido, {account.name}", "mail": account.mail}), 200
        else:
            return jsonify({"error": "Credenciales incorrectas"}), 401
    finally:
        db_session.close()


@auth_bp.route("/logout", methods=["GET"])
def logout():
    session.pop("user", None)
    session.pop("db_path", None)
    return jsonify({"message": "Sesión cerrada correctamente"}), 200


@auth_bp.before_app_request
def load_user_db():
    db_path = session.get("db_path")
    if db_path:
        g.db_session = get_user_session(db_path)
    else:
        g.db_session = None


@auth_bp.teardown_app_request
def close_db_session(exception=None):
    db_session = getattr(g, "db_session", None)
    if db_session is not None:
        db_session.close()
