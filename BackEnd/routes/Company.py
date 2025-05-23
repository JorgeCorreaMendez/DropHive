import traceback

from BackEnd.utils.logger import logger

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
        logger.error("An error occurred while retrieving companies")
        traceback.print_exc()
        return jsonify({"error": "retrieving companies"}), 500


@companies_bp.route("/add_company", methods=["POST"])
@login_required
def add_company():
    try:
        data = request.get_json()
        name = data.get("name")
        description = data.get("description")
        profile_picture = data.get("profile_picture")
        if not name:
            return jsonify({"error": "Company name is required"}), 400
        with get_db_session(session["db.name"]) as db_session:
            existing = db_session.query(Company).filter_by(name=name).first()
            if existing:
                return jsonify({"error": "A company with that name already exists"}), 409
            new_company = Company(name=name, description=description, profile_picture=profile_picture)
            db_session.add(new_company)
            db_session.commit()
            logger.info(f"Company '{new_company.name}' created successfully.")
            return jsonify({"message": f"Company '{new_company.name}' created successfully."}), 201
    except SQLAlchemyError:
        logger.error("An error occurred while creating the company")
        traceback.print_exc()
        return jsonify({"error": "Error creating the company"}), 500


@companies_bp.route("/modify_company", methods=["PUT"])
@login_required
def modify_company():
    try:
        data = request.get_json()
        company_id = data.get("id")
        company_name = session["db.name"]
        db_session = get_db_session(company_name)
        company = db_session.query(Company).filter_by(id=company_id).first()
        if not company:
            return jsonify({"error": "Company not found"}), 404
        if "name" in data:
            company.name = data["name"]
        if "description" in data:
            company.description = data["description"]
        if "profile_picture" in data:
            company.profile_picture = data["profile_picture"]
        db_session.commit()
        logger.info(f"Company '{company.name}' successfully modified.")
        return jsonify({"message": "Company successfully modified"}), 200
    except SQLAlchemyError:
        logger.error("An error occurred while modifying the company")
        traceback.print_exc()
        return jsonify({"error": "modifying the company"}), 500


@companies_bp.route("/delete_company", methods=["DELETE"])
@login_required
def delete_company():
    try:
        company_id = request.args.get('id')
        if not company_id:
            return jsonify({"error": "Company ID is required"}), 400
        with (get_db_session("Users") as users_db,
              get_db_session(session["db.name"]) as client_db):
            company = client_db.query(Company).filter_by(id=company_id).first()
            if not company:
                return jsonify({"error": "Company not found"}), 404
            users_to_delete = users_db.query(User).filter_by(db_name=company.name).all()
            client_db.delete(company)
            for user in users_to_delete:
                users_db.delete(user)
            client_db.commit()
            users_db.commit()
            logger.info(f"Company '{company.name}' and its users deleted successfully.")
        return jsonify({"message": f"Company '{company.name}' and its users deleted successfully."}), 200
    except SQLAlchemyError as e:
        logger.error(f"SQLAlchemy error: {str(e)}")
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
        logger.error("An error occurred while deleting the company")
        traceback.print_exc()
        return jsonify({"error": "Error deleting the company"}), 500


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
            return jsonify([company.serialize() for company in query.all()]), 200
    except SQLAlchemyError:
        logger.error("An error occurred while filtering companies")
        traceback.print_exc()
        return jsonify({"Error, while searching Companies"}), 500


# TDOO. cambiar ruta en front
@companies_bp.route("/get_company", methods=["GET"])
@login_required
def search_category_by_id():
    company_id = request.args.get('id')
    if not company_id:
        logger.error("Company ID is required")
        return jsonify({"error": "Company ID is required"}), 400
    try:
        with get_db_session(session["db.name"]) as db:
            company = db.query(Company).filter(Company.id == company_id).first()
            if company is None:
                return jsonify({"message": "Company not found"}), 404
            return jsonify(company.serialize()), 200
    except SQLAlchemyError:
        logger.error("An error occurred while retrieving company by ID")
        traceback.print_exc()
        return jsonify({"error": "Error retrieving company by ID"}), 500
