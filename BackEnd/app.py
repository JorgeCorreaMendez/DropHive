import os

from flask import Flask, render_template, session, redirect, url_for, send_file
from werkzeug.utils import send_from_directory

from BackEnd.routes.Accounts import accounts_bp
from BackEnd.routes.Auth import auth_bp
from BackEnd.routes.Category import categories_bp
from BackEnd.routes.Privilege import privileges_bp
from BackEnd.routes.Product import products_bp
from BackEnd.routes.Register import registro_bp

from pathlib import Path

app = Flask(__name__, template_folder="../FrontEnd/html", static_folder="../FrontEnd")
app.secret_key = os.getenv("test", "1234")
app.register_blueprint(auth_bp)
app.register_blueprint(registro_bp)
app.register_blueprint(products_bp)
app.register_blueprint(privileges_bp)
app.register_blueprint(accounts_bp)
app.register_blueprint(categories_bp)
app.json.ensure_ascii = False


@app.route("/")
def index():
    if "user_id" in session:
        return redirect(url_for("home"))
    else:
        return redirect(url_for("login"))


@app.route("/<string:db_name>/home")
def home(db_name):
    return render_template("home.html")


@app.route('/templates/<template_name>')
def servir_header_parcial(template_name):
    template = os.path.join(app.template_folder, template_name)
    template2 = Path(template)

    try:
        # Verificación de seguridad básica
        if not template_name.endswith('.html'):
            template_name += '.html'

        return send_file(template2)
    except Exception as e:
        return f"Error al cargar el template: {str(e)}", 404

@app.route("/login")
def login():
    return render_template("LogIn.html")


if __name__ == "__main__":
    app.run(debug=True, port=4000)
