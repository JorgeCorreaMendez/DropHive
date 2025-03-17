from flask import Flask
import os

from Models import db, Productos

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////Users/jorgecorrea/Documents/ULPGC/3º Año/1º Semestre/AP/Practicas/Examen Python/Mochila 0/DropHive/BaseDatos/DropHive.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)


@app.route("/")
def getProducts():
    productos = Productos.query.all()
    for producto in productos:
        print(producto)

    return "<h1>test</h1>"


if __name__ == "__main__":
    app.run(debug=True, port=4000)
