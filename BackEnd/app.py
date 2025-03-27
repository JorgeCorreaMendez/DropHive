import os

from flask import Flask, jsonify, render_template

from BackEnd.DB_utils import get_all_values_from
from BackEnd.models.Account import Account
from BackEnd.models.Category import Category
from BackEnd.models.Privilege import Privilege
from BackEnd.routes.Auth import auth_bp, login_required
from BackEnd.routes.Product import products_bp
from BackEnd.routes.Register import registro_bp

app = Flask(__name__, template_folder="../FrontEnd/html", static_folder="../FrontEnd")
app.secret_key = os.getenv("test", "1234")
app.register_blueprint(auth_bp)
app.register_blueprint(registro_bp)
app.register_blueprint(products_bp)
app.json.ensure_ascii = False


@app.route("/")
def index():
    return render_template("LogIn.html")

@app.route("/<string:db_name>/home")
def home(db_name):
    return render_template("home.html")


@app.route("/<string:dbname>/privileges")
@login_required
def get_privileges(dbname):
    try:
        return jsonify(get_all_values_from(Privilege, dbname)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /privileges: {e}")
        return jsonify({"error": "Error al obtener la lista de privilegios."}), 500


@app.route("/<string:dbname>/accounts")
@login_required
def get_accounts(dbname):
    try:
        return jsonify(get_all_values_from(Account, dbname)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /accounts: {e}")
        return jsonify({"error": "Error al obtener las cuentas."}), 500


@app.route("/<string:dbname>/category")
@login_required
def get_category(dbname):
    try:
        return jsonify(get_all_values_from(Category, dbname)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        print(f"Error en /category: {e}")
        return jsonify({"error": "Error al obtener las categorías."}), 500


if __name__ == "__main__":
    app.run(debug=True, port=4000)
