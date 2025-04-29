from sqlalchemy import func

from BackEnd.models.Size import Size
from BackEnd.utils.sqlalchemy_methods import get_db_session


def get_all_values_from(model, dbname):
    with get_db_session(dbname) as db_session:
        return [item.serialize() for item in db_session.query(model).all()]


def get_total_quantity_query(db_session):
    return (
        db_session.query(
            Size.product_id.label('id'),
            func.sum(Size.quantity).label('quantity')
        )
        .group_by(Size.product_id)
        .subquery()
    )
