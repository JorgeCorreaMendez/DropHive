from flask import Blueprint, request, jsonify, session

from BackEnd.models.Category import Category
from BackEnd.models.Product import Product
from BackEnd.models.Company import Company
from BackEnd.utils.sqlalchemy_methods import get_db_session

searchbar_bp = Blueprint("searchbar", __name__)


@searchbar_bp.route("/search", methods=["GET"])
def search():
    query = request.args.get("q", '').lower()
    if not query:
        return jsonify([])

    with get_db_session(session["db.name"]) as db_session:
        products = db_session.query(Product).filter(Product.name.ilike(f"%{query}%")).all()
        categories = db_session.query(Category).filter(Category.name.ilike(f"%{query}%")).all()
        company = db_session.query(Company).filter(Company.name.ilike(f"%{query}%"), Company.id != '1').all()

        result = {
            'categories': [category.serialize() for category in categories],
            'companies': [company.serialize() for company in company],
            'products': [product.serialize() for product in products],
        }
        return jsonify(result)
