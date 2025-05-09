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
    category_id = Column(Integer, ForeignKey('categories.id'))
    category = relationship("Category", back_populates="products")
    sizes = relationship("Size", back_populates="product", cascade="all, delete-orphan")

    @property
    def quantity(self):
        return sum(size.quantity for size in self.sizes)

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
            "quantity": self.quantity,
            "size": [size.serialize() for size in self.sizes]
        }

    def get_total_quantity(self):
        return self.quantity
