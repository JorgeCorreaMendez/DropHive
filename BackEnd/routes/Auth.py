import traceback
from functools import wraps

from flask import request, jsonify, session, Blueprint, redirect, url_for

from BackEnd.models.Account import Account
from BackEnd.models.User import User
from BackEnd.services.user_service import get_user_by
from BackEnd.utils.bcrypt_methods import verify_hash
from BackEnd.utils.logger import logger
from BackEnd.utils.sqlalchemy_methods import get_db_session

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        mail = data.get("mail")
        password = data.get("password")
        if not mail or not password:
            return jsonify({"error": "Email and password are required."}), 400
        user = get_user_by(mail)
        if not user:
            return jsonify({"error": "Account does not exist."}), 400
        with get_db_session(user.db_name) as account_session:
            account = account_session.query(Account).filter_by(mail=mail).first()
            if not verify_hash(password, account.password):
                return jsonify({"error": "Incorrect credentials"}), 401
            session["user"] = account.name
            session["db.name"] = user.db_name
            logger.info(f"{account.name} has logged into {user.db_name}")
            return jsonify({
                "message": f"Welcome, {account.name}",
                "db_name": f"{user.db_name}"
            }), 200
    except Exception as e:
        logger.error("An error occurred during login")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/logout", methods=["GET"])
def logout():
    logger.info(f"User {session.get('user')} has logged out.")
    session.pop("user", None)
    return jsonify({"message": "Session successfully closed"}), 200


# TODO. se ejecuta siempre?
# TODO. change
@auth_bp.route("/aceptar_primer_login", methods=["POST"])
def accept_first_login():
    mail = request.args.get("mail")
    if not mail:
        return jsonify({"error": "Email parameter is required."}), 400
    try:
        with get_db_session("Users") as user_session:
            user = user_session.query(User).filter_by(mail=mail).first()
            if not user:
                return jsonify({"error": f"User with email {mail} not found."}), 404
            user.first_login = False
            user_session.commit()
            logger.info(f"First login accepted for user {mail}")
            return jsonify({"message": "Password change accepted."}), 200
    except Exception as e:
        logger.error("An error occurred while accepting the first login")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


def login_required(route_function):
    @wraps(route_function)
    def decorated_function(*args, **kwargs):
        if "user" not in session:
            return redirect(url_for("pages.login"))
        return route_function(*args, **kwargs)

    return decorated_function
