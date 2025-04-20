from BackEnd.models.User import User
from BackEnd.utils.sqlalchemy_methods import get_db_session


def get_user_by(mail):
    with get_db_session("Users") as user_session:
        return user_session.query(User).filter_by(mail=mail).first()