import os

from flask import Flask, render_template, session, redirect, url_for

from BackEnd.routes.Accounts import accounts_bp
from BackEnd.routes.Auth import auth_bp
from BackEnd.routes.Category import categories_bp
from BackEnd.routes.Privilege import privileges_bp
from BackEnd.routes.Product import products_bp
from BackEnd.routes.Register import registro_bp

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


@app.route("/login")
def login():
    return render_template("LogIn.html")


if __name__ == "__main__":
    app.run(debug=True, port=4000)
