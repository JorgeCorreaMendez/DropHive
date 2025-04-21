from sqlalchemy import Integer, String, Text, Float, ForeignKey, Column
from sqlalchemy.orm import relationship
from BackEnd.models.Size import Size

from BackEnd.models import Base


class Product(Base):
    __tablename__ = 'products'

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    quantity = Column(Integer, default=0)
    category_id = Column(Integer, ForeignKey('categories.id'))
    category = relationship("Category", back_populates="products")
    sizes = relationship("Size", back_populates="product", cascade="all, delete-orphan")

    def __str__(self):
        return "{}, {}, {}".format(self.id, self.name, self.description)

    def serialize(self):
        return {
            "product_id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "category_id": self.category_id,
            "discount": self.discount,
            "size": [size.serialize() for size in self.sizes]
        }
