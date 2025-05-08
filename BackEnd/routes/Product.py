import traceback

from flask import request, jsonify, Blueprint, session
from sqlalchemy.exc import SQLAlchemyError

from BackEnd.models.Category import Category
from BackEnd.models.Product import Product
from BackEnd.models.Size import Size
from BackEnd.routes.Auth import login_required
from BackEnd.services.models_service import get_all_values_from, get_total_quantity_query
from BackEnd.utils.sqlalchemy_methods import get_db_session

products_bp = Blueprint("products", __name__)


@products_bp.route("/products", methods=["GET"])
@login_required
def get_products():
    try:
        return jsonify(get_all_values_from(Product, session["db.name"])), 200, {
            'Content-Type': 'application/json; charset=utf-8'}
    except SQLAlchemyError:
        print("Error, obteniendo los productos")
        traceback.print_exc()
        return jsonify({"error": "obteniendo los productos"}), 500


@products_bp.route("/add_product", methods=["POST"])
@login_required
def add_product():
    try:
        data = request.get_json()
        with get_db_session(session["db.name"]) as db_session:
            category = db_session.query(Category).filter_by(name=data["category"]["name"]).first()
            if not category:
                category = Category(name=data["category"]["name"])
                db_session.add(category)
                db_session.flush()

            new_product = Product(
                id=data["id"],
                name=data["name"],
                category_id=category.id,
                description=data["description"],
                price=data["price"],
                discount=data["discount"],
            )
            db_session.add(new_product)
            db_session.flush()
            if "sizes" in data:
                for size in data["sizes"]:
                    db_session.add(Size(
                        product_id=new_product.id,
                        name=size["name"],
                        quantity=size["quantity"]
                    ))
            db_session.commit()
        return jsonify({"message": "Producto añadido correctamente"}), 201
    except SQLAlchemyError:
        print("Error, añadiendo un nuevo producto")
        traceback.print_exc()
        return jsonify({"error": "añadiendo un nuevo producto"}), 500


@products_bp.route("/modify_product/<string:product_id>", methods=["PUT"])
@login_required
def modify_product(product_id):
    """
    Actualiza un producto existente:
      - name, description, price, discount
      - categoría (busca o crea)
      - tallas (borra las previas y añade las nuevas)
    Devuelve el producto completo con tallas al front-end.
    """
    try:
        data = request.get_json(force=True)
        with get_db_session(session["db.name"]) as db_session:
            # 1) Buscar el producto
            product = db_session.query(Product).filter_by(id=product_id).first()
            if not product:
                return jsonify({"error": "Producto no encontrado"}), 404

            # 2) Actualizar campos simples
            for field in ("name", "description", "price", "discount"):
                if field in data:
                    setattr(product, field, data[field])

            # 3) Actualizar categoría (crear si no existe)
            if data.get("category", {}).get("name"):
                cat_name = data["category"]["name"]
                category = db_session.query(Category).filter_by(name=cat_name).first()
                if not category:
                    category = Category(name=cat_name)
                    db_session.add(category)
                    db_session.flush()
                product.category_id = category.id

            # 4) Reemplazar tallas: borrar las antiguas y añadir las nuevas
            if "sizes" in data:
                db_session.query(Size).filter_by(product_id=product.id).delete()
                for sz in data["sizes"]:
                    db_session.add(Size(
                        product_id=product.id,
                        name=sz["name"],
                        quantity=sz["quantity"]
                    ))

            db_session.commit()

            # 5) Serializar salida con tallas
            result = product.serialize()
            result["sizes"] = [
                {"name": s.name, "quantity": s.quantity}
                for s in db_session.query(Size).filter_by(product_id=product.id)
            ]
        return jsonify(result), 200

    except SQLAlchemyError:
        traceback.print_exc()
        return jsonify({"error": "Error modificando productos"}), 500
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Error inesperado"}), 500

@products_bp.route("/delete_product", methods=["DELETE"])
@login_required
def delete_product():
    try:
        id_product = request.args.get('id')
        print("Estamos borrando el articulo", id_product)
        with get_db_session(session["db.name"]) as db_session:
            product = db_session.query(Product).filter_by(id=id_product).first()
            if not product:
                print("Error, producto no encontrado")
                return jsonify({"error": "Producto no encontrado"}), 404
            db_session.delete(product)
            db_session.commit()
        return jsonify({"message": "Producto eliminado correctamente"}), 200
    except SQLAlchemyError:
        print("Error, eliminando el producto")
        traceback.print_exc()
        return jsonify({"error": "eliminando el producto"}), 500


# TODO. cambiar ruta en front
# TODO. crear servicio para filtrar por ID
@products_bp.route('/filter_product_by_id', methods=["GET"])
@login_required
def search_product_by_id():
    try:
        id_product = request.args.get('id')
        with get_db_session(session["db.name"]) as db_session:
            products = db_session.query(Product).filter(id_product == Product.id).all()
            if products:
                return jsonify([product.serialize() for product in products]), 200
            else:
                return jsonify({"message": "No se encontraron productos con ese ID."}), 404
    except SQLAlchemyError:
        print("Error, buscando el producto")
        traceback.print_exc()
        return jsonify({"error": "buscando el producto"}), 500


# TODO: Cambiar category_id en la DB
@products_bp.route('/filter_products', methods=["GET"])
@login_required
def filter_products():
    try:
        category_name = request.args.get('category')
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        max_quantity = request.args.get('max_quantity')
        limit = int(request.args.get('limit', 5))
        offset = int(request.args.get('offset', 0))
        with (get_db_session(session["db.name"]) as db_session):
            query = db_session.query(Product).join(Category)
            total = db_session.query(Product).count()
            if category_name:
                query = query.filter(Category.name == category_name)
            if min_price:
                query = query.filter(Product.price >= float(min_price))
            if max_price:
                query = query.filter(Product.price <= float(max_price))
            if max_quantity:
                query_quantity = get_total_quantity_query(db_session)
                query = query.join(query_quantity, Product.id == query_quantity.c.id)
                query = query.filter(query_quantity.c.quantity <= int(max_quantity))
            query = query.limit(limit).offset(offset)
            print({"productos": [product.serialize() for product in query.all()], "total": total})
            return jsonify({"productos": [product.serialize() for product in query.all()], "total": total}), 200
    except SQLAlchemyError:
        print("Error, filtrando los productos")
        traceback.print_exc()
        return jsonify({"error": "filtrando los productos"}), 500

from sqlalchemy import or_

@products_bp.route('/similar_products/<string:product_id>', methods=["GET"])
@login_required
def get_similar_products(product_id):
    try:
        with get_db_session(session["db.name"]) as db_session:
            original = db_session.query(Product).get(product_id)
            if not original:
                return jsonify({"error": "Producto no encontrado"}), 404

            print(original)
            # Dividir el nombre original en palabras clave
            search_terms = original.name.split()
            name_filters = [Product.name.ilike(f"%{term}%") for term in search_terms]

            # Buscar productos similares
            similares = (
                db_session.query(Product)
                .filter(Product.id != product_id)
                .filter(Product.category_id == original.category_id)
                .limit(5)
                .all()
            )

            print("Similares encontrados:", [p.name for p in similares])

            return jsonify([p.serialize() for p in similares]), 200

    except SQLAlchemyError:
        traceback.print_exc()
        return jsonify({"error": "Error buscando productos similares"}), 500

