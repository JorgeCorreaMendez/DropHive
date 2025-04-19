from BackEnd.utils.sqlalchemy_methods import get_db_session


def get_all_values_from(model, dbname):
    with get_db_session(dbname) as db_session:
        return [item.serialize() for item in db_session.query(model).all()]
