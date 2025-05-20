import os

from flask import Blueprint, session

from BackEnd.routes.Auth import login_required

log_bp = Blueprint('log_bp', __name__)


@log_bp.route("/get_log_file", methods=["GET"])
@login_required
def get_log_file():
    db_name = session["db.name"]
    log_path = os.path.join("../log", f"{db_name}.log")
    print(log_path)
    if not os.path.exists(log_path):
        return "Log file not found", 404
    with open(log_path, "r") as f:
        content = f.read()
    return content, 200
