from db import db

class Category(db.Model):
    __tablename__ = "categories"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    descripcion = db.Column(db.String(250), unique=False, nullable=True)

class Item(db.Model):
    __tablename__ = "items"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)
    discount = db.Column(db.Float, default=0.0)
    sizes = db.Column(db.String(100), nullable=True)  # "S,M,L,XL"
    quantity_per_size = db.Column(db.String(100), nullable=True)  # "10,5,8,3"

    category = db.relationship("Category", backref="items")
