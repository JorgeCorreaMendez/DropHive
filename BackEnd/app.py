import os
import random

from flask import Flask, render_template, session, redirect, url_for, jsonify, request
from flask_mail import Mail, Message

from BackEnd.models.Account import Account
from BackEnd.routes.Accounts import accounts_bp
from BackEnd.routes.Auth import auth_bp, login_required
from BackEnd.routes.Category import categories_bp
from BackEnd.routes.Privilege import privileges_bp
from BackEnd.routes.Product import products_bp
from BackEnd.routes.Register import registro_bp
from BackEnd.utils.DB_utils import get_db_session
from BackEnd.utils.hashing import create_hash

app = Flask(__name__, template_folder="../FrontEnd/html", static_folder="../FrontEnd")
app.secret_key = os.getenv("secret_key", "12")
app.register_blueprint(auth_bp)
app.register_blueprint(registro_bp)
app.register_blueprint(products_bp)
app.register_blueprint(privileges_bp)
app.register_blueprint(accounts_bp)
app.register_blueprint(categories_bp)
app.config['APPLICATION_ROOT'] = '/'
app.json.ensure_ascii = False

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")

mail = Mail(app)


@app.route("/send_verification_code/<string:email>", methods=["GET"])
def send_verification_code(email):
    try:
        verification_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])

        msg = Message(subject="Código de Verificación - DropHive",
                      sender="jorgecorreame@gmail.com",
                      recipients=[email])
        msg.body = f"Tu código de verificación es: {verification_code}"
        mail.send(msg)
        session["verification_code"] = verification_code
        return jsonify({"message": "Código de verificación enviado correctamente."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/change_password", methods=["POST"])
def change_password():
    data = request.get_json()
    if "verification_code" not in session:
        return jsonify({"error": "Código de verificación no encontrado o expirado."}), 400
    if session["verification_code"] == data.get("code"):
        email = data.get("mail")
        new_password = data.get("password")
        try:
            with get_db_session("DropHive") as db:
                account = db.query(Account).filter_by(mail=email).first()
                if account:
                    account.password = create_hash(new_password)
                    db.commit()
                    session.pop("verification_code")
                    return jsonify({"message": "Contraseña actualizada correctamente."}), 200
                else:
                    return jsonify({"error": "Correo electrónico no encontrado."}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "El código de validación no es correcto"}), 400


@app.route("/")
def index():
    print(session.values())
    if "adidas" in session:
        return redirect(url_for("home"))
    else:
        return redirect(url_for("login"))


@app.route("/<string:db_name>/home")
@login_required
def home(db_name):
    return render_template("home.html")


@app.route("/login")
def login():
    return render_template("LogIn.html")


@app.route("/<string:db_name>/addAndModifyCategory")
def add_and_modify_category(db_name):
    return render_template("addAndModifyCategory.html")


@app.route("/<string:db_name>/addAndModifyCompany")
def add_and_modify_company(db_name):
    return render_template("AddAndModifyCompany.html")


@app.route("/<string:db_name>/addEmployee")
def add_employee(db_name):
    return render_template("addEmployee.html")


@app.route("/<string:db_name>/categoryPage")
def category_page(db_name):
    return render_template("categoryPage.html")


@app.route("/<string:db_name>/createItem")
def create_item(db_name):
    return render_template("CreateItem.html")


@app.route("/<string:db_name>/log")
def log(db_name):
    return render_template("log.html")


@app.route("/<string:db_name>/modifyAccount")
def modify_account(db_name):
    return render_template("modifyAccount.html")


@app.route("/<string:db_name>/notifications")
def notifications(db_name):
    return render_template("notifications.html")


@app.route("/<string:db_name>/profile")
def profile(db_name):
    return render_template("profile.html")


@app.route("/<string:db_name>/readArticle")
def read_article(db_name):
    return render_template("Read_Article.html")


@app.route("/<string:db_name>/readCompany")
def read_company(db_name):
    return render_template("readCompany.html")


@app.route("/<string:db_name>/supply")
def supply(db_name):
    return render_template("supply.html")


@app.route("/<string:db_name>/viewEmployeeAction")
def view_employee_action(db_name):
    return render_template("ViewEmployeeAction.html")


if __name__ == "__main__":
    app.run(debug=True, port=4000)
