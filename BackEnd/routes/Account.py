from flask import jsonify, Blueprint, request, session
from sqlalchemy.exc import SQLAlchemyError

from BackEnd.models.Account import Account
from BackEnd.models.User import User
from BackEnd.routes.Auth import login_required
from BackEnd.services.models_service import get_all_values_from
from BackEnd.services.user_service import get_user_by
from BackEnd.utils.bcrypt_methods import create_hash
from BackEnd.utils.logger import logger
from BackEnd.utils.sqlalchemy_methods import get_db_session

accounts_bp = Blueprint("accounts", __name__)


@accounts_bp.route("/accounts", methods=["GET"])
@login_required
def get_accounts():
    try:
        result = get_all_values_from(Account, session["db.name"])
        return jsonify(result), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except SQLAlchemyError:
        logger.error("An error occurred while retrieving the accounts.")
        return jsonify({"An error occurred while retrieving the accounts"}), 500


@accounts_bp.route("/create_account", methods=["POST"])
def create_account():
    data = request.get_json()
    name = session["db.name"]
    mail = data.get("mail")
    password = data.get("password")
    if not name or not mail or not password:
        return jsonify({"error": "Missing required fields"}), 400
    try:
        with (get_db_session(session["db.name"]) as client_session,
              get_db_session("Users") as user_session):
            if client_session.query(Account).filter_by(mail=mail).first():
                return jsonify({"error": "Email is already registered"}), 400
            new_account = Account(
                name=name,
                mail=mail,
                password=create_hash(password),
                phone=data.get("phone"),
                address=data.get("address"),
                privilege_id=1
            )
            new_user = User(mail=mail, db_name=name)
            client_session.add(new_account)
            user_session.add(new_user)
            client_session.commit()
            user_session.commit()
        logger.info(f"Account successfully created for {mail}.")
        return jsonify({"message": "Account successfully created"}), 201
    except SQLAlchemyError:
        logger.error("An error occurred while creating the account.")
        return jsonify({"error": "Error while creating the account"}), 500


@accounts_bp.route("/modify_account", methods=["PUT"])
@login_required
def modify_account():
    account_id = request.args.get("id")
    data = request.get_json()
    if not account_id:
        return jsonify({"error": "Missing account ID"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            account = db.query(Account).filter_by(id=account_id).first()
            if not account:
                return jsonify({"error": "Account not found"}), 404
            if "name" in data:
                account.name = data["name"]
            if "mail" in data:
                if db.query(Account).filter(Account.mail == data["mail"], Account.id != account_id).first():
                    return jsonify({"error": "Email is already registered"}), 409
                account.mail = data["mail"]
            if "phone" in data:
                account.phone = data["phone"]
            if "address" in data:
                account.address = data["address"]
            if "password" in data:
                account.password = create_hash(data["password"])
            db.commit()
        logger.info(f"Account with ID {account_id} modified.")
        return jsonify({"message": "Account successfully modified"}), 200
    except SQLAlchemyError:
        logger.error("An error occurred while modifying the account.")
        return jsonify({"error": "Error while modifying the account"}), 500


@accounts_bp.route("/delete_account", methods=["DELETE"])
@login_required
def delete_account():
    try:
        account_id = request.args.get('id')
        with (get_db_session(session["db.name"]) as client_db,
              get_db_session("Users") as users_db):
            account = client_db.query(Account).filter_by(id=account_id).first()
            user = users_db.query(User).filter_by(mail=account.mail).first()
            if not account:
                return jsonify({"error": "Account not found"}), 404
            client_db.delete(account)
            users_db.delete(user)
            client_db.commit()
            users_db.commit()
        logger.info(f"Account {user.name} deleted.")
        return jsonify({"message": "Account successfully deleted"}), 200
    except SQLAlchemyError:
        try:
            if client_db:
                client_db.rollback()
        except SQLAlchemyError:
            pass
        try:
            if users_db:
                users_db.rollback()
        except SQLAlchemyError:
            pass
        logger.error("An error occurred while deleting the account.")
        return jsonify({"error": "Error while deleting the account"}), 500


@accounts_bp.route("/change_password", methods=["POST"])
def change_password():
    data = request.get_json()
    email = data.get("mail")
    new_password = data.get("password")
    try:
        with get_db_session(get_user_by(email).db_name) as db:
            account = db.query(Account).filter_by(mail=email).first()
            if account:
                account.password = create_hash(new_password)
                db.commit()
                logger.info(f"Password updated for {email}.")
                return jsonify({"message": "Password successfully updated."}), 200
            else:
                return jsonify({"error": "Email not found."}), 404
    except SQLAlchemyError:
        logger.error("An error occurred while changing the password.")
        return jsonify({"error": "Error while changing the password"}), 500


@accounts_bp.route('/filter_account_by_id', methods=["GET"])
@login_required
def search_account_by_id():
    try:
        id = request.args.get('id')
        with get_db_session(session["db.name"]) as db_session:
            accounts = db_session.query(Account).filter(id == Account.id).all()
            if accounts:
                logger.info(f"Account found with ID {id}.")
                return jsonify([account.serialize() for account in accounts]), 200
            else:
                return jsonify({"message": "No account found with that ID."}), 404
    except SQLAlchemyError:
        logger.error("An error occurred while searching account by ID.")
        return jsonify({"error": "Error while searching for the account"}), 500


@accounts_bp.route('/filter_account_by_mail', methods=["GET"])
@login_required
def search_account_by_mail():
    try:
        mail = request.args.get('mail')
        with get_db_session(session["db.name"]) as db_session:
            accounts = db_session.query(Account).filter(mail == Account.mail).all()
            if accounts:
                logger.info(f"Account(s) found with email {mail}.")
                return jsonify([account.serialize() for account in accounts]), 200
            else:
                return jsonify({"message": "No account found with that email."}), 404
    except SQLAlchemyError:
        logger.error("An error occurred while searching account by mail.")
        return jsonify({"error": "Error while searching for the account"}), 500


@accounts_bp.route('/check_first_login', methods=["GET"])
@login_required
def check_first_login():
    try:
        mail = request.args.get('mail')
        with get_db_session("Users") as user_session:
            user = user_session.query(User).filter(mail == User.mail).first()
            if user:
                return jsonify(user.serialize()), 200
            else:
                return jsonify({"message": "No user found with that email."}), 404
    except SQLAlchemyError:
        logger.error("An error occurred while checking first login.")
        return jsonify({"error": "Error while checking first login"}), 500


@accounts_bp.route('/change_first_login', methods=["PUT"])
@login_required
def change_first_login():
    try:
        mail = request.args.get('mail')
        with get_db_session("Users") as user_session:
            user = user_session.query(User).filter(mail == User.mail).first()
            if user:
                user.first_login = 0
                user_session.commit()
                logger.info(f"First login flag changed for {mail}.")
                return jsonify("First login flag successfully changed."), 200
            else:
                return jsonify({"message": "No user found with that email."}), 404
    except SQLAlchemyError:
        logger.error("An error occurred while changing first login.")
        return jsonify({"error": "Error while changing first login"}), 500
