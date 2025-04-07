import os
from flask_mail import Mail, Message
from flask import Flask, current_app


def init_mail(app: Flask):
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
    app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
    return Mail(app)


def send_email(subject, sender, recipients, body):
    mail = init_mail(current_app)
    msg = Message(subject=subject,
                  sender=sender,
                  recipients=recipients)
    msg.body = body
    mail.send(msg)
