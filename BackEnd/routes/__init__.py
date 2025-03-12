from flask import Blueprint
from .auth_routes import auth_bp
from .item_routes import item_bp
from .category_routes import category_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(item_bp, url_prefix="/items")
    app.register_blueprint(category_bp, url_prefix="/categories")
