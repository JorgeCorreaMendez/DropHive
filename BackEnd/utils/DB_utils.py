import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../DB")
SessionLocal = scoped_session(sessionmaker())


def get_engine(dbname):
    db_path = os.path.join(DB_PATH, f"{dbname}.db")
    return create_engine(f"sqlite:///{db_path}")


def get_all_values_from(model, dbname):
    engine = get_engine(dbname)
    SessionLocal.configure(bind=engine)
    with SessionLocal() as db_session:
        return [item.serialize() for item in db_session.query(model).all()]


def get_db_session(dbname):
    engine = get_engine(dbname)
    SessionLocal.configure(bind=engine)
    session = SessionLocal()
    try:
        return session
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()
