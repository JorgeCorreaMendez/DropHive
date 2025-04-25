from flask import Blueprint, redirect, url_for, render_template, session

from BackEnd.routes.Auth import login_required

pages_bp = Blueprint("pages", __name__)


@pages_bp.route("/")
def index():
    if "user" in session:
        return redirect(url_for("pages.home"))
    else:
        return redirect(url_for("pages.login"))


@pages_bp.route("/register")
def register():
    return render_template('register.html')


@pages_bp.route("/home")
@login_required
def home():
    return render_template("home.html")


@pages_bp.route("/login")
def login():
    return render_template("LogIn.html")


@pages_bp.route("/forgotten_password")
def forgotten_password():
    return render_template("send_mail_for_password.html")


@pages_bp.route("/change_password")
def change_password():
    return render_template("change_password.html")


@pages_bp.route("/verification_code")
def verification_code():
    return render_template("CodigoDeVerificacion.html")


@pages_bp.route("/addAndModifyCategory")
def add_and_modify_category():
    return render_template("addAndModifyCategory.html")


@pages_bp.route("/addAndModifyCompany")
def add_and_modify_company():
    return render_template("AddAndModifyCompany.html")


@pages_bp.route("/addEmployee")
def add_employee():
    return render_template("addEmployee.html")


@pages_bp.route("/categoryPage")
def category_page():
    return render_template("categoryPage.html")


@pages_bp.route("/createItem")
def create_item():
    return render_template("CreateItem.html")


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
    return render_template("read_article_2.html")


@pages_bp.route("/readCompany")
def read_company():
    return render_template("readCompany.html")


@pages_bp.route("/supply")
def supply():
    return render_template("supply.html")


@pages_bp.route("/viewEmployeeAction")
def view_employee_action():
    return render_template("ViewEmployeeAction.html")


@pages_bp.route("/home2")
def home_temporal():
    return render_template("home-temporal.html")
