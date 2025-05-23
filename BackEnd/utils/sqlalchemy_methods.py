import os
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from BackEnd.models import UserBase

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../DB")


def get_engine(dbname):
    db_path = os.path.join(DB_PATH, f"{dbname}.db")
    return create_engine(f"sqlite:///{db_path}")


def get_db_session(dbname):
    engine = get_engine(dbname)
    Session = sessionmaker()
    Session.configure(bind=engine)
    return Session()


def database_exists(dbname):
    return bool(inspect(get_engine(dbname)).get_table_names())


def init_user_db():
    UserBase.metadata.create_all(get_engine("Users"))
