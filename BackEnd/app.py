import os

from flask import Flask
from BackEnd.routes.Account import accounts_bp
from BackEnd.routes.Auth import auth_bp
from BackEnd.routes.Category import categories_bp
from BackEnd.routes.Company import companies_bp
from BackEnd.routes.Mail import email_bp
from BackEnd.routes.Privilege import privileges_bp
from BackEnd.routes.Product import products_bp
from BackEnd.routes.Register import registro_bp
from BackEnd.routes.pages import pages_bp
from BackEnd.utils.flask_mail_methods import init_mail
from BackEnd.utils.sqlalchemy_methods import init_user_db

app = Flask(__name__, template_folder="../FrontEnd/html", static_folder="../FrontEnd")
app.secret_key = os.getenv("SECRET_KEY")
app.register_blueprint(auth_bp)
app.register_blueprint(registro_bp)
app.register_blueprint(products_bp)
app.register_blueprint(privileges_bp)
app.register_blueprint(accounts_bp)
app.register_blueprint(categories_bp)
app.register_blueprint(companies_bp)
app.register_blueprint(email_bp)
app.register_blueprint(pages_bp)
app.config['APPLICATION_ROOT'] = '/'
app.json.ensure_ascii = False
init_user_db()
mail = init_mail(app)

if __name__ == "__main__":
    app.run(debug=True, port=4000)
