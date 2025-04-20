from flask import Blueprint, session, redirect, url_for, render_template

from BackEnd.routes.Auth import login_required

pages_bp = Blueprint("pages", __name__)


@pages_bp.route("/")
def index():
    if "user" in session:
        return redirect(url_for("home"))
    else:
        return redirect(url_for("auth.login"))


@pages_bp.route("/register")
def register():
    return render_template('register.html')


@pages_bp.route("/<string:db_name>/home")
@login_required
def home(db_name):
    return render_template("home.html")


@pages_bp.route("/login")
def login():
    return render_template("LogIn.html")


@pages_bp.route("/forgotted_password")
def forgotted_password():
    return render_template("send_mail_for_password.html")


@pages_bp.route("/change_password")
def change_password():
    return render_template("change_password.html")


@pages_bp.route("/verification_code")
def verification_code():
    return render_template("CodigoDeVerificacion.html")


@pages_bp.route("/<string:db_name>/addAndModifyCategory")
def add_and_modify_category(db_name):
    return render_template("addAndModifyCategory.html")


@pages_bp.route("/<string:db_name>/addAndModifyCompany")
def add_and_modify_company(db_name):
    return render_template("AddAndModifyCompany.html")


@pages_bp.route("/<string:db_name>/addEmployee")
def add_employee(db_name):
    return render_template("addEmployee.html")


@pages_bp.route("/<string:db_name>/categoryPage")
def category_page(db_name):
    return render_template("categoryPage.html")


@pages_bp.route("/<string:db_name>/createItem")
def create_item(db_name):
    return render_template("CreateItem.html")


@pages_bp.route("/<string:db_name>/log")
def log(db_name):
    return render_template("log.html")


@pages_bp.route("/<string:db_name>/modifyAccount")
def modify_account(db_name):
    return render_template("modifyAccount.html")


@pages_bp.route("/<string:db_name>/notifications")
def notifications(db_name):
    return render_template("notifications.html")


@pages_bp.route("/<string:db_name>/profile")
def profile(db_name):
    return render_template("profile.html")


@pages_bp.route("/<string:db_name>/readArticle")
def read_article(db_name):
    return render_template("Read_Article.html")


@pages_bp.route("/<string:db_name>/readCompany")
def read_company(db_name):
    return render_template("readCompany.html")


@pages_bp.route("/<string:db_name>/supply")
def supply(db_name):
    return render_template("supply.html")


@pages_bp.route("/<string:db_name>/viewEmployeeAction")
def view_employee_action(db_name):
    return render_template("ViewEmployeeAction.html")


@pages_bp.route("/<string:db_name>/home2")
def home_temporal(db_name):
    return render_template("home-temporal.html")
