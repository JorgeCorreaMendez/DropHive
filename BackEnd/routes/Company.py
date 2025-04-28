from flask import Blueprint, jsonify, session, request
from sqlalchemy.exc import SQLAlchemyError

from BackEnd.models.Company import Company
from BackEnd.models.User import User
from BackEnd.routes.Auth import login_required
from BackEnd.services.models_service import get_all_values_from
from BackEnd.utils.sqlalchemy_methods import get_db_session

companies_bp = Blueprint("companies", __name__)


@companies_bp.route("/companies")
@login_required
def get_accounts():
    try:
        return jsonify(get_all_values_from(Company, session["db.name"])), 200, {
            'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@companies_bp.route("/modify_company", methods=["POST"])
@login_required
def modify_company():
    try:
        data = request.get_json()
        company_name = session["db.name"]
        db_session = get_db_session(company_name)
        company = db_session.query(Company).filter_by(name=company_name).first()
        if not company:
            return jsonify({"error": "Empresa no encontrada"}), 404
        if "name" in data:
            company.name = data["name"]
        if "description" in data:
            company.description = data["description"]
        if "profile_picture" in data:
            company.profile_picture = data["profile_picture"]
        db_session.commit()
        return jsonify({"message": "Empresa modificada correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@companies_bp.route("/delete_company", methods=["POST"])
@login_required
def delete_company():
    try:
        company_name = session["db.name"]
        with (get_db_session(company_name) as client_db,
              get_db_session("Users") as users_db):
            company = client_db.query(Company).filter_by(name=company_name).first()
            users_to_delete = users_db.query(User).filter_by(db_name=company_name).all()
            if not company or not users_to_delete:
                return jsonify({"error": "Empresa no encontrada"}), 404
            client_db.delete(company)
            for user in users_to_delete:
                users_db.delete(user)
            client_db.commit()
            users_db.commit()
        return jsonify({"message": "Empresa y usuarios asociados eliminados correctamente"}), 200
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
