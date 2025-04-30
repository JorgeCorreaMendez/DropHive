import traceback

from flask import jsonify, Blueprint, request, session
from sqlalchemy.exc import SQLAlchemyError

from BackEnd.models.Account import Account
from BackEnd.models.User import User
from BackEnd.routes.Auth import login_required
from BackEnd.services.user_service import get_user_by
from BackEnd.utils.bcrypt_methods import create_hash
from BackEnd.utils.sqlalchemy_methods import get_db_session
from BackEnd.services.models_service import get_all_values_from

accounts_bp = Blueprint("accounts", __name__)


@accounts_bp.route("/accounts", methods=["GET"])
@login_required
def get_accounts():
    try:
        return jsonify(get_all_values_from(Account, session["db.name"])), 200, {
            'Content-Type': 'application/json; charset=utf-8'}
    except SQLAlchemyError:
        print("Ocurrio un error obteniendo las cuentas: ")
        traceback.print_exc()
        return jsonify({"Ocurrio un error obteniendo las cuentas"}), 500


# TODO. añadir privilegios SPRINT2
@accounts_bp.route("/create_account", methods=["POST"])
def create_account():
    data = request.get_json()
    name = session["db.name"]
    mail = data.get("mail")
    password = data.get("password")
    if not name or not mail or not password:
        print("Error, Faltan datos obligatorios")
        return jsonify({"error": "Faltan datos obligatorios"}), 400
    try:
        with (get_db_session(session["db.name"]) as client_session,
              get_db_session("Users") as user_session):
            if client_session.query(Account).filter_by(mail=mail).first():
                print("Error, El correo ya está registrado")
                return jsonify({"error": "El correo ya está registrado"}), 400
            new_account = Account(
                name=name,
                mail=mail,
                password=create_hash(password),
                phone=data.get("phone"),
                address=data.get("address"),
                privilege_id=1
            )
            new_user = User(
                mail=mail,
                db_name=name
            )
            client_session.add(new_account)
            user_session.add(new_user)
            client_session.commit()
            user_session.commit()
        return jsonify({"message": "Cuenta creada correctamente"}), 201
    except SQLAlchemyError:
        print("Error, al crear la cuenta")
        traceback.print_exc()
        return jsonify({"Error, al crear la cuenta"}), 500

@accounts_bp.route("/modify_account", methods=["POST"])
@login_required
def modify_account():
    account_id = request.args.get("id", type=int)
    data = request.get_json()
    if not account_id:
        print("Error, Falta el ID de la cuenta")
        return jsonify({"error": "Falta el ID de la cuenta"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            account = db.query(Account).filter_by(id=account_id).first()
            if not account:
                print("Error, Cuenta no encontrada")
                return jsonify({"error": "Cuenta no encontrada"}), 404
            if "name" in data:
                account.name = data["name"]
            if "mail" in data:
                if db.query(Account).filter(Account.mail == data["mail"], Account.id != account_id).first():
                    print("Error, El correo ya está registrado")
                    return jsonify({"error": "El correo ya está registrado"}), 409
                account.mail = data["mail"]
            if "phone" in data:
                account.phone = data["phone"]
            if "address" in data:
                account.address = data["address"]
            if "password" in data:
                account.password = create_hash(data["password"])
            db.commit()
        return jsonify({"message": "Cuenta modificada correctamente"}), 200
    except SQLAlchemyError:
        print("Error, al modificar la cuenta")
        traceback.print_exc()
        return jsonify({"Error, al modificar la cuenta"}), 500


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
                print("Error, Cuenta no encontrada")
                return jsonify({"error": "Cuenta no encontrada"}), 404
            client_db.delete(account)
            users_db.delete(user)
            client_db.commit()
            users_db.commit()
        return jsonify({"message": "Cuenta eliminada correctamente"}), 200
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
        print("Error, al eliminar la cuenta")
        traceback.print_exc()
        return jsonify({"Error, al eliminar la cuenta"}), 500


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
                return jsonify({"message": "Contraseña actualizada correctamente."}), 200
            else:
                print("Correo electrónico no encontrado")
                return jsonify({"error": "Correo electrónico no encontrado."}), 404
    except SQLAlchemyError:
        print("Error, al cambiar la contraseña")
        traceback.print_exc()
        return jsonify({"Error, al cambiar la contraseña"}), 500


# TODO. cambiar en front
@accounts_bp.route('/filter_account_by_id', methods=["GET"])
@login_required
def search_account_by_id():
    try:
        id = request.args.get('id')
        with get_db_session(session["db.name"]) as db_session:
            accounts = db_session.query(Account).filter(id == Account.id).all()
            if accounts:
                return jsonify([account.serialize() for account in accounts]), 200
            else:
                return jsonify({"message": "No se encontraron productos con ese ID."}), 404
    except SQLAlchemyError:
        print("Error, al buscar la cuenta")
        traceback.print_exc()
        return jsonify({"Error, al buscar la cuenta"}), 500

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
                return jsonify({"message": "No se encontraron productos con ese ID."}), 404
    except SQLAlchemyError:
        print("Error, al buscar la cuenta")
        traceback.print_exc()
        return jsonify({"Error, al buscar la cuenta"}), 500

@accounts_bp.route('/change_first_login', methods=["GET"])
@login_required
def change_first_login():
    try:
        mail = request.args.get('mail')
        with get_db_session("Users") as user_session:
            user = user_session.query(User).filter(mail == User.mail).first()
            if user:
                user.first_login = 0
                user_session.commit()
                return jsonify("Se ha modificado correctamente el primer LogIn."), 200
            else:
                return jsonify({"message": "No se encontraron productos con ese ID."}), 404
    except SQLAlchemyError:
        print("Error, al buscar la cuenta")
        traceback.print_exc()
        return jsonify({"Error, al buscar la cuenta"}), 500