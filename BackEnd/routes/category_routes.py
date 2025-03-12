# routes/category_routes.py
from flask import Blueprint, jsonify

# Definir el Blueprint
category_bp = Blueprint('category_bp', __name__)

# Ruta para obtener todas las categorías
@category_bp.route('/categories', methods=['GET'])
def get_categories():
    # Simulamos una lista de categorías como ejemplo
    categories = [
        {"id": 1, "name": "Electronics"},
        {"id": 2, "name": "Clothing"},
        {"id": 3, "name": "Books"}
    ]
    return jsonify(categories)

# Ruta para obtener una categoría por ID
@category_bp.route('/categories/<int:id>', methods=['GET'])
def get_category(id):
    categories = [
        {"id": 1, "name": "Electronics"},
        {"id": 2, "name": "Clothing"},
        {"id": 3, "name": "Books"}
    ]
    category = next((cat for cat in categories if cat["id"] == id), None)
    
    if category:
        return jsonify(category)
    else:
        return jsonify({"error": "Category not found"}), 404
