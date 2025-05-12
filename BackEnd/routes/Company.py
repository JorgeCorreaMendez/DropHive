import traceback

from flask import Blueprint, jsonify, session, request
from sqlalchemy.exc import SQLAlchemyError

from BackEnd.models.Company import Company
from BackEnd.models.User import User
from BackEnd.routes.Auth import login_required
from BackEnd.services.models_service import get_all_values_from
from BackEnd.utils.sqlalchemy_methods import get_db_session

companies_bp = Blueprint("companies", __name__)


@companies_bp.route("/companies", methods=["GET"])
@login_required
def get_companies():
    try:
        return jsonify(get_all_values_from(Company, session["db.name"])), 200, {
            'Content-Type': 'application/json; charset=utf-8'}
    except SQLAlchemyError:
        print("Error, obteniendo las empresas")
        traceback.print_exc()
        return jsonify({"error": "obteniendo las empresas"}), 500

@companies_bp.route('/filter_company', methods=["GET"])
@login_required
def filter_company():
    try:
        limit = int(request.args.get('limit', 5))
        offset = int(request.args.get('offset', 0))
        with (get_db_session(session["db.name"]) as db_session):
            query = db_session.query(Company)
            query = query.filter(Company.id != 1)
            query = query.limit(limit).offset(offset)
            print([company.serialize() for company in query.all()])
            return jsonify([company.serialize() for company in query.all()]), 200
    except SQLAlchemyError:
        print("Error, filtrando la compañia")
        traceback.print_exc()
        return jsonify({"Error, while searching Companies"}), 500


@companies_bp.route("/modify_company", methods=["POST"])
@login_required
def modify_company():
    try:
        data = request.get_json()
        company_name = session["db.name"]
        db_session = get_db_session(company_name)
        company = db_session.query(Company).filter_by(name=company_name).first()
        if not company:
            print("Error, Empresa no encontrada")
            return jsonify({"error": "Empresa no encontrada"}), 404
        if "name" in data:
            company.name = data["name"]
        if "description" in data:
            company.description = data["description"]
        if "profile_picture" in data:
            company.profile_picture = data["profile_picture"]
        db_session.commit()
        return jsonify({"message": "Empresa modificada correctamente"}), 200
    except SQLAlchemyError:
        print("Error, modificando la empresa")
        traceback.print_exc()
        return jsonify({"error": "modificando la empresa"}), 500


@companies_bp.route("/delete_company", methods=["DELETE"])
@login_required
def delete_company():
    try:
        company_name = session["db.name"]
        with (get_db_session(company_name) as client_db,
              get_db_session("Users") as users_db):
            company = client_db.query(Company).filter_by(name=company_name).first()
            users_to_delete = users_db.query(User).filter_by(db_name=company_name).all()
            if not company or not users_to_delete:
                print("Error, Empresa o encontrada")
                return jsonify({"error": "Empresa no encontrada"}), 404
            client_db.delete(company)
            for user in users_to_delete:
                users_db.delete(user)
            client_db.commit()
            users_db.commit()
        return '', 204
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
        print("Error, eliminando la empresa")
        traceback.print_exc()
        return jsonify({"Error:": "eliminando la empresa"}), 500

@companies_bp.route("/get_company", methods=["GET"])
@login_required
def search_category_by_id():
    company_id = request.args.get('id')
    if not company_id:
        print("Error, Se tiene que añadir un id")
        return jsonify({"error": "Se tiene que añadir un id"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            company = db.query(Company).filter(Company.id == company_id).first()
            if company is None:
                return jsonify({"message": "Compañia no encontrada"}), 404
            print(company.serialize())
            return jsonify(company.serialize()), 200
    except SQLAlchemyError:
        print("Error, al cambiar la contraseña")
        traceback.print_exc()
        return jsonify({"Error, al cambiar la contraseña"}), 500