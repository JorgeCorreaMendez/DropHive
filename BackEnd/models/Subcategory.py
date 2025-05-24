from sqlalchemy import Table, Column, ForeignKey, String, Integer
from BackEnd.models import Base

product_secondary_categories = Table(
    'product_secondary_categories',
    Base.metadata,
    Column('product_id', String, ForeignKey('products.id'), primary_key=True),
    Column('category_id', Integer, ForeignKey('categories.id'), primary_key=True)
)
