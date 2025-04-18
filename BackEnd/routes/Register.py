from flask import Blueprint, request, jsonify

from BackEnd.models import Base
from BackEnd.models.Account import Account
from BackEnd.models.User import User
from BackEnd.schemas import UserRegisterSchema
from BackEnd.utils.bcrypt_methods import create_hash
from BackEnd.utils.sqlalchemy_methods import get_db_session, get_engine

registro_bp = Blueprint("registro", __name__)


def register_company(user_data):
    try:
        db_name = user_data.name
        Base.metadata.create_all(get_engine(db_name))
        with get_db_session(db_name) as db_session:
            new_account = Account(
                name=user_data.name,
                mail=user_data.mail,
                password=create_hash(user_data.password),
                phone=user_data.phone,
                description=user_data.description,
                address=user_data.address,
                privilege_id=user_data.privilege_id
            )
            db_session.add(new_account)
            db_session.commit()

        with get_db_session("Users") as session:
            new_user = User(
                mail=user_data.mail,
                db_name=db_name
            )
            session.add(new_user)
            session.commit()
        return True, f"Company {db_name} registered successfully."
    except Exception as e:
        print(e)
        return False, e


@registro_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    user_data = UserRegisterSchema(**data)
    success, message = register_company(user_data)
    if not success:
        return jsonify({"error": str(message)}), 500
    return jsonify({"message": str(message)}), 200
