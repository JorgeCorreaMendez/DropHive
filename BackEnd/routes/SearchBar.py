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
        print("No pasa")
        return jsonify([])

    print("Pasa")
    with get_db_session(session["db.name"]) as db_session:
        productos = db_session.query(Product).filter(Product.name.ilike(f"%{query}%")).all()
        categorias = db_session.query(Category).filter(Category.name.ilike(f"%{query}%")).all()
        company = db_session.query(Company).filter(Company.name.ilike(f"%{query}%"), Company.id != '1').all()

        resultados = {
            'categories': [categoria.serialize() for categoria in categorias],
            'companies': [company.serialize() for company in company],
            'products': [producto.serialize() for producto in productos],
        }
        return jsonify(resultados)