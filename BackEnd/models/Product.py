from sqlalchemy import Integer, String, Text, Float, ForeignKey, Column
from sqlalchemy.orm import relationship

from BackEnd.models import Base


class Product(Base):
    __tablename__ = 'products'

    product_id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    size = Column(String)
    quantity = Column(Integer)
    category_id = Column(Integer, ForeignKey('categories.id'))
    category = relationship("Category", back_populates="products")

    def __str__(self):
        return "{}, {}, {}".format(self.product_id, self.name, self.description)

    def serialize(self):
        return {
            "product_id": self.product_id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "category_id": self.category_id,
            "discount": self.discount,
            "size": self.size,
            "quantity": self.quantity
        }
