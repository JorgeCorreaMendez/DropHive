from flask import Blueprint, request, jsonify
from sqlalchemy.exc import SQLAlchemyError

from BackEnd.models import Base
from BackEnd.models.Account import Account
from BackEnd.models.Company import Company
from BackEnd.models.User import User
from BackEnd.schemas import UserRegisterSchema
from BackEnd.utils.bcrypt_methods import create_hash
from BackEnd.utils.sqlalchemy_methods import get_db_session, get_engine

registro_bp = Blueprint("registro", __name__)


@registro_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        user_data = UserRegisterSchema(**data)
        db_name = user_data.name
        Base.metadata.create_all(get_engine(db_name))
        with (get_db_session(db_name) as client_db,
              get_db_session("Users") as users_db):
            new_company = Company(
                name=db_name,
                description=user_data.description,
            )
            client_db.add(new_company)
            client_db.flush()
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
                db_name=db_name
            )
            client_db.add(new_account)
            users_db.add(new_user)
            client_db.commit()
            users_db.commit()
        return jsonify({"message": f"Company {db_name} registered successfully."}), 200
    except Exception as e:
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
        return jsonify({"error": str(e)}), 500
