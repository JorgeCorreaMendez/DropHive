from flask import Blueprint, jsonify
from flask_mail import Message

password = Blueprint("categories_bp", __name__)


def get_validate_code():
    print()
