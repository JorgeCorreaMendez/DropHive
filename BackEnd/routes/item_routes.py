from flask import Blueprint, request, jsonify
from db import db
from models import Item

item_bp = Blueprint("items", __name__)

@item_bp.route("/", methods=["GET"])
def get_items():
    items = Item.query.all()
    return jsonify([{"id": i.id, "name": i.name, "price": i.price} for i in items])

@item_bp.route("/", methods=["POST"])
def create_item():
    data = request.json
    item = Item(name=data["name"], price=data["price"], category_id=data["category_id"])
    db.session.add(item)
    db.session.commit()
    return jsonify({"msg": "Artículo creado"}), 201
