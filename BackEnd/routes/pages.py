from flask import Blueprint, redirect, url_for, render_template, session

from BackEnd.routes.Auth import login_required

pages_bp = Blueprint("pages", __name__)


@pages_bp.route("/")
def index():
    if "user" in session:
        return redirect(url_for("pages.home"))
    else:
        return redirect(url_for("pages.login"))


@pages_bp.route("/login")
def login():
    return render_template("login/login.html")


@pages_bp.route("/register")
def register():
    return render_template('login/register.html')


@pages_bp.route("/changePassword")
def change_password():
    return render_template("login/changePassword.html")


@pages_bp.route("/home")
@login_required
def home():
    return render_template("home/home.html")


# TODO. cambiar ruta
@pages_bp.route("/createItem")
def create_item():
    return render_template("home/createProduct.html")


@pages_bp.route("/addAndModifyCategory")
def add_and_modify_category():
    return render_template("addAndModifyCategory.html")


@pages_bp.route("/addAndModifyCompany")
def add_and_modify_company():
    return render_template("addAndModifyCompany.html")


@pages_bp.route("/addEmployee")
def add_employee():
    return render_template("addEmployee.html")


@pages_bp.route("/categoryPage")
def category_page():
    return render_template("categoryPage.html")


@pages_bp.route("/readCategory")
def read_category():
    return render_template("readCategory.html")


@pages_bp.route("/log")
def log():
    return render_template("log.html")


@pages_bp.route("/modifyAccount")
def modify_account():
    return render_template("modifyAccount.html")


@pages_bp.route("/notifications")
def notifications():
    return render_template("notifications.html")


@pages_bp.route("/profile")
def profile():
    return render_template("profile.html")


@pages_bp.route("/readArticle")
def read_article():
    return render_template("readArticle.html")


@pages_bp.route("/readCompany")
def read_company():
    return render_template("readCompany.html")


@pages_bp.route("/supply")
def supply():
    return render_template("supply.html")


@pages_bp.route("/viewEmployeeAction")
def view_employee_action():
    return render_template("viewEmployeeAction.html")


@pages_bp.route("/home2")
def home_temporal():
    return render_template("login-temporal.html")
