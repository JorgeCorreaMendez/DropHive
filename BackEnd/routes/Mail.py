import os
import random
import traceback
from smtplib import SMTPException

from flask import Blueprint, session, jsonify, request

from BackEnd.routes.Account import accounts_bp
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
    except SMTPException:
        print("Error, enviando el codigo de verificación")
        traceback.print_exc()
        return jsonify({"error": "enviando el codigo de verificación"}), 500


# TODO
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
    except SMTPException:
        print("Error, enviando la contraseña a la nueva cuenta")
        traceback.print_exc()
        return jsonify({"error": "enviando la contraseña a la nueva cuenta"}), 500


@email_bp.route("/check_mail", methods=["GET"])
def check_mail():
    mail = request.args.get('mail')
    try:
        user = get_user_by(mail)
        if user:
            return jsonify({"dbname": user.db_name}), 200
        else:
            return jsonify({"error": "Correo no encontrado"}), 404
    except SMTPException:
        print("Error, comprobando el correo")
        traceback.print_exc()
        return jsonify({"error": "comprobando el correo"}), 500


@accounts_bp.route("/check_verification_code", methods=["POST"])
def check_verification_code():
    if session["verification_code"] == request.get_json().get("code"):
        return jsonify({"message": "Código correcto"}), 200
    else:
        return jsonify({"error": "Código incorrecto"}), 400
