from sqlalchemy import Column, Integer, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import relationship

from BackEnd.models import Base


class Size(Base):
    __tablename__ = 'sizes'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(10), nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    product_id = Column(String, ForeignKey('products.id'), nullable=False)
    product = relationship("Product", back_populates="sizes")

    __table_args__ = (
        UniqueConstraint('product_id', 'name', name='uix_product_size'),
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "quantity": self.quantity
        }
