from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from datetime import timedelta

auth_bp = Blueprint("auth", __name__)

users = {"admin": "password123"}  # Simulación de usuarios

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if users.get(username) == password:
        access_token = create_access_token(identity=username, expires_delta=timedelta(hours=1))
        return jsonify(access_token=access_token), 200

    return jsonify({"msg": "Credenciales inválidas"}), 401
