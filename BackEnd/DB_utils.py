import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../DB")


def get_all_values_from(model, dbname):
    db_path = os.path.join(DB_PATH, dbname + ".db")
    engine = create_engine(f"sqlite:///{db_path}")
    Session = sessionmaker(bind=engine)
    with Session() as db_session:
        return [item.serialize() for item in db_session.query(model).all()]
