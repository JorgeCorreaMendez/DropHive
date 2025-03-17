from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import relationship
from BackEnd.models import db


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(Integer, primary_key=True, autoincrement=True)
    name = db.Column(String, nullable=False)
    description = db.Column(Text)
    products = relationship("Product", back_populates="category")

    def __str__(self):
        return "{}, {}, {}, {}".format(self.id, self.name, self.description, self.products)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "products": self.products,
        }
