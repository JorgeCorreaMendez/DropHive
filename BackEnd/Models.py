from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import *
from sqlalchemy.orm import relationship

db = SQLAlchemy()


class Privilegio(db.Model):
    __tablename__ = 'privilegios'

    id = db.Column(Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(String, nullable=False)
    permisos = db.Column(Text)
    cuentas = relationship("Cuenta", back_populates="privilegio_id")


class Cuenta(db.Model):
    __tablename__ = 'cuentas'

    id = db.Column(Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(String, nullable=False)
    correo = db.Column(String, unique=True, nullable=False)
    contraseña_hash = db.Column(String, nullable=False)
    tlf = db.Column(Text)
    descripcion = db.Column(Text)
    direccion = db.Column(Text)
    privilegio = db.Column(Integer, ForeignKey('privilegios.id'))
    privilegio_id = relationship("Privilegio", back_populates="cuentas")


class Categoria(db.Model):
    __tablename__ = 'categorias'

    id = db.Column(Integer, primary_key=True, autoincrement=True)
    name = db.Column(String, nullable=False)
    descripcion = db.Column(Text)
    productos = relationship("Productos", back_populates="categoria")


class Productos(db.Model):
    __tablename__ = 'productos'

    id = db.Column(Integer, primary_key=True, autoincrement=True)
    name = db.Column(String, nullable=False)
    description = db.Column(Text)
    precio = db.Column(Float, default=0.0)
    category_id = db.Column(Integer, ForeignKey('categorias.id'))
    descuento = db.Column(Float, default=0.0)
    size = db.Column(String)
    quantity = db.Column(Integer)
    categoria = relationship("Categoria", back_populates="productos")

    def __str__(self):
        return "{}, {}, {}".format(self.id, self.name, self.description)


