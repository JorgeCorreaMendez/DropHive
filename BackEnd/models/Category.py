from sqlalchemy import Integer, String, Text, Column
from sqlalchemy.orm import relationship
from BackEnd.models import Base
from BackEnd.models.Subcategory import product_secondary_categories

class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text)
    products = relationship(
        "Product",
        back_populates="category",
        cascade="all, delete-orphan"
    )
    products_as_secondary = relationship(
        "Product",
        secondary=product_secondary_categories,
        back_populates="secondary_categories"
    )

    def __str__(self):
        return "{}, {}, {}, {}".format(self.id, self.name, self.description, self.products)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "products": [product.serialize() for product in self.products],
            "products_as_secondary": [product.id for product in self.products_as_secondary]
        }
