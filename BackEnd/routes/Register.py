import os
import traceback

from flask import Blueprint, request, jsonify
from sqlalchemy.exc import SQLAlchemyError

from BackEnd.models import Base
from BackEnd.models.Account import Account
from BackEnd.models.Company import Company
from BackEnd.models.Privilege import Privilege
from BackEnd.models.User import User
from BackEnd.schemas import UserRegisterSchema
from BackEnd.utils.bcrypt_methods import create_hash
from BackEnd.utils.sqlalchemy_methods import get_db_session, get_engine, database_exists

registro_bp = Blueprint("registro", __name__)


@registro_bp.route("/register", methods=["POST"])
def register():
    try:
        user_data = UserRegisterSchema(**request.get_json())
        db_name = user_data.name
        if database_exists(db_name):
            return jsonify({"error": "Company is already registered."}), 409
        engine = get_engine(db_name)
        Base.metadata.create_all(engine)
        with (get_db_session(db_name) as client_db,
              get_db_session("Users") as users_db):
            new_company = Company(
                name=db_name,
                description=user_data.description,
            )
            client_db.add(new_company)
            client_db.flush()
            new_privilege = Privilege(
                id=1,
                name="Admin"
            )
            new_account = Account(
                name="Admin",
                mail=user_data.mail,
                password=create_hash(user_data.password),
                phone=user_data.phone,
                address=user_data.address,
                privilege_id=user_data.privilege_id,
                company_id=new_company.id
            )
            new_user = User(
                mail=user_data.mail,
                db_name=db_name,
                first_login=False
            )
            client_db.add(new_account)
            client_db.add(new_privilege)
            users_db.add(new_user)
            client_db.commit()
            users_db.commit()
        return jsonify({"message": f"Company {db_name} registered successfully."}), 201
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
        traceback.print_exc()
        return jsonify({"error": "An error occurred during registration"}), 500


@registro_bp.route("/check_company", methods=["GET"])
def check_company():
    name = request.args.get("name")
    if not name:
        return jsonify({"error": "Company name is missing"}), 400
    if os.path.exists(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../DB", f"{name}.db"))):
        return jsonify({"message": "The company exists"}), 200
    return jsonify({"error": "checking the company"}), 404
