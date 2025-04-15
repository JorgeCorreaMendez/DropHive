from BackEnd.models import db


class Product(db.Model):
    __tablename__ = 'products'

    product_id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, default=0.0)
    discount = db.Column(db.Float, default=0.0)
    size = db.Column(db.String)
    quantity = db.Column(db.Integer)

    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    category = db.relationship("Category", back_populates="products")

    def __str__(self):
        return f"{self.product_id}, {self.name}, {self.description}"

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
