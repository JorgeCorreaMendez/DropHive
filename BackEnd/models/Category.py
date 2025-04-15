from BackEnd.models import db


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)

    products = db.relationship("Product", back_populates="category")

    def __str__(self):
        return f"{self.id}, {self.name}, {self.description}, {self.products}"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "products": [product.serialize() for product in self.products]
        }
