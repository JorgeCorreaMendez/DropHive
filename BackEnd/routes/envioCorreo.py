import smtplib
import random
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage


def send_verification_email(to_email):
    verification_code = random.randint(100000, 999999)

    smtp_server = "smtp.gmail.com"
    smtp_port = 567
    sender_email = "drophive@gmail.com"
    sender_password = "drophiveemail"

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = "Verification code"

    body =f"""
    <html>
        <body>
            <h2>¡Muchas gracias por registrarte!</h2>
            <p>Tu código de verificación es: <strong>{verification_code}</strong></p>
            <p>Por favor, ingrésalo en el formulario para continuar con la validación.</p>
            <p>El equipo de DropHive</p>
        </body>
    </html>
    """
    msg.attach(MIMEText(body, 'html'))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())
        server.quit()
        print("Email enviado correctamente")
    except Exception as e:
        print(f"Error al enviar el correo: {e}")