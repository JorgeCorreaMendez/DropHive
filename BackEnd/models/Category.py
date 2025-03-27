from sqlalchemy import Integer, String, Text, Column
from sqlalchemy.orm import relationship
from BackEnd.models import Base


class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    products = relationship("Product", back_populates="category")

    def __str__(self):
        return "{}, {}, {}, {}".format(self.id, self.name, self.description, self.products)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "products": [product.serialize() for product in self.products]
        }
