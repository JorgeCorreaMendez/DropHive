from flask import jsonify, Blueprint, request, session

from BackEnd.models.Account import Account
from BackEnd.models.User import User
from BackEnd.routes.Auth import login_required
from BackEnd.services.user_service import get_user_by
from BackEnd.utils.bcrypt_methods import create_hash
from BackEnd.utils.sqlalchemy_methods import get_db_session
from BackEnd.services.models_service import get_all_values_from

accounts_bp = Blueprint("accounts", __name__)


@accounts_bp.route("/accounts")
@login_required
def get_accounts():
    try:
        return jsonify(get_all_values_from(Account, session["db.name"])), 200, {
            'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# TODO. añadir privilegios SPRINT2
@accounts_bp.route("/create_account", methods=["POST"])
def create_account():
    data = request.get_json()
    db_name = session["db.name"]
    mail = data.get("mail")
    password = data.get("password")
    if not db_name or not mail or not password:
        return jsonify({"error": "Faltan datos obligatorios"}), 400
    try:
        with (get_db_session(db_name) as client_session,
            get_db_session("Users") as user_session):
            if client_session.query(Account).filter_by(mail=mail).first() or user_session.query(User).filter_by(mail=mail).first():
                return jsonify({"error": "El correo ya está registrado"}), 400
            new_account = Account(
                name=db_name,
                mail=mail,
                password=create_hash(password),
                phone=data.get("phone"),
                description=data.get("description"),
                address=data.get("address")
            )
            new_user = User(
                mail=mail,
                db_name=db_name
            )
            client_session.add(new_account)
            user_session.add(new_user)
            client_session.commit()
            user_session.commit()
        return jsonify({"message": "Cuenta creada correctamente"}), 201
    except Exception as e:
        return jsonify({"Error, al crear la cuenta": str(e)}), 500


@accounts_bp.route("/modify_account", methods=["POST"])
@login_required
def modify_account():
    account_id = request.args.get("id", type=int)
    data = request.get_json()
    if not account_id:
        return jsonify({"error": "Falta el ID de la cuenta"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            account = db.query(Account).filter_by(id=account_id).first()
            if not account:
                return jsonify({"error": "Cuenta no encontrada"}), 404
            if "name" in data:
                account.name = data["name"]
            if "mail" in data:
                if db.query(Account).filter(Account.mail == data["mail"], Account.id != account_id).first():
                    return jsonify({"error": "El correo ya está registrado"}), 400
                account.mail = data["mail"]
            if "phone" in data:
                account.phone = data["phone"]
            if "description" in data:
                account.description = data["description"]
            if "address" in data:
                account.address = data["address"]
            if "password" in data:
                account.password = create_hash(data["password"])
            db.commit()
        return jsonify({"message": "Cuenta modificada correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@accounts_bp.route("/delete_account", methods=["GET"])
@login_required
def delete_account():
    try:
        account_id = request.args.get('id')
        with get_db_session(session["db.name"]) as db_session:
            account = db_session.query(Account).filter_by(id=account_id).first()
            if not account:
                return jsonify({"error": "Cuenta no encontrado"}), 404
            db_session.delete(account)
            db_session.commit()
        return jsonify({"message": "Cuenta eleminada correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@accounts_bp.route("/change_password", methods=["POST"])
def change_password():
    if "verification_code" not in session:
        return jsonify({"error": "Código de verificación no encontrado o expirado."}), 400
    data = request.get_json()
    email = data.get("mail")
    new_password = data.get("password")
    try:
        with get_db_session(get_user_by(email).db_name) as db:
            account = db.query(Account).filter_by(mail=email).first()
            if account:
                account.password = create_hash(new_password)
                db.commit()
                session.pop("verification_code")
                return jsonify({"message": "Contraseña actualizada correctamente."}), 200
            else:
                return jsonify({"error": "Correo electrónico no encontrado."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@accounts_bp.route("/check_verification_code", methods=["POST"])
def check_verification_code():
    if session["verification_code"] == request.get_json().get("code"):
        return jsonify({}), 200
    else:
        return jsonify({}), 400

@accounts_bp.route('/filter_account_by_id')
@login_required
def search_product_by_id():
    try:
        id_product = request.args.get('id')
        with get_db_session(session["db.name"]) as db_session:
            accounts = db_session.query(Account).filter(id_product == Account.id).all()
            if accounts:
                return jsonify([account.serialize() for account in accounts]), 200
            else:
                return jsonify({"message": "No se encontraron productos con ese ID."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500