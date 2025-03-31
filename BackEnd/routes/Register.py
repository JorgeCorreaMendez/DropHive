import os

from flask import Blueprint, request, jsonify, render_template
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from BackEnd import schemas
from BackEnd.models import Base
from BackEnd.models.Account import Account
from BackEnd.utils.DB_utils import DB_PATH
from BackEnd.utils.hashing import create_hash

registro_bp = Blueprint("registro", __name__)


# TODO: split en el html
def register_company(user_data):
    db_name = user_data.name
    db_path = os.path.join(DB_PATH, f"{db_name}.db")
    if os.path.exists(db_path):
        return False, f"La empresa {db_name} ya existe."

    engine = create_engine(f"sqlite:///{db_path}")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    with Session() as db_session:
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

    return True, f"Company {db_name} registered successfully."


@registro_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        user_data = schemas.UserRegisterSchema(**data)
        print(user_data)
        success, message = register_company(user_data)
        if not success:
            return jsonify({"error": message}), 409
        return jsonify({"message": message}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@registro_bp.route("/register")
def mostrar_register():
    return render_template('register.html')