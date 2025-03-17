from sqlalchemy import Integer, String, Text, Float, ForeignKey
from sqlalchemy.orm import relationship

from BackEnd.models import db
from BackEnd.models.Category import Category


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(Integer, primary_key=True, autoincrement=True)
    name = db.Column(String, nullable=False)
    description = db.Column(Text)
    price = db.Column(Float, default=0.0)
    discount = db.Column(Float, default=0.0)
    size = db.Column(String)
    quantity = db.Column(Integer)
    category_id = db.Column(Integer, ForeignKey('categories.id'))
    category = relationship("Category", back_populates="products")

    def __str__(self):
        return "{}, {}, {}".format(self.id, self.name, self.description)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "category_id": self.category_id,
            "discount": self.discount,
            "size": self.size,
            "quantity": self.quantity
        }
