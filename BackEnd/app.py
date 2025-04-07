import os

from flask import Flask, render_template, session, redirect, url_for

from BackEnd.routes.Accounts import accounts_bp
from BackEnd.routes.Auth import auth_bp, login_required
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
app.config['APPLICATION_ROOT'] = '/'
app.json.ensure_ascii = False


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

@app.route("/<string:db_name>/home2")
def home_temporal(db_name):
    return render_template("home-temporal.html")


if __name__ == "__main__":
    app.run(debug=True, port=4000)
