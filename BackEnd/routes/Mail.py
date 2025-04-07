import os
import random

from flask import Blueprint, session, jsonify
from BackEnd.utils.flask_mail_methods import send_email

email_bp = Blueprint('email_bp', __name__)


@email_bp.route("/send_verification_code/<string:email>", methods=["GET"])
def send_verification_code(email):
    try:
        verification_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        subject = "Código de Verificación - DropHive"
        sender = os.getenv("MAIL_USERNAME")
        recipients = [email]
        body = f"Tu código de verificación es: {verification_code}"
        send_email(subject, sender, recipients, body)
        session["verification_code"] = verification_code
        return jsonify({"message": "Código de verificación enviado correctamente."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
