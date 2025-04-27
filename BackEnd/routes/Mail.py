import os
import random

from flask import Blueprint, session, jsonify, request

from BackEnd.routes.Accounts import accounts_bp
from BackEnd.services.user_service import get_user_by
from BackEnd.utils.flask_mail_methods import send_email

email_bp = Blueprint('email_bp', __name__)


@email_bp.route("/send_verification_code", methods=["GET"])
def send_verification_code():
    try:
        mail = request.args.get('mail')
        verification_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        subject = "Código de Verificación - DropHive"
        sender = os.getenv("MAIL_USERNAME")
        recipients = [mail]
        body = f"Tu código de verificación es: {verification_code}"
        send_email(subject, sender, recipients, body)
        session["verification_code"] = verification_code
        return jsonify({"message": "Código de verificación enviado correctamente."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@email_bp.route("/new_account_registered", methods=["GET"])
def new_account_registered():
    try:
        mail = request.args.get('mail')
        password = request.args.get('password')
        subject = "Added to a project"
        sender = os.getenv("MAIL_USERNAME")
        recipients = [mail]
        body = f"You have been added to a project, your password is {password}."
        send_email(subject, sender, recipients, body)
        return jsonify({"message": "El correo se ha enviado correctamente."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@accounts_bp.route("/check_mail")
def check_mail():
    mail = request.args.get('mail')
    try:
        user = get_user_by(mail)
        if user:
            return jsonify({"dbname": user.db_name}), 200
        else:
            return jsonify({"Error": "Correo no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
