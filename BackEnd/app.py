from logging import exception

from flask import Flask, jsonify

from Models import db, Productos

app = Flask(__name__)
app.json.ensure_ascii = False
app.config["SQLALCHEMY_DATABASE_URI"] = ("sqlite://///Users/jorgecorrea/Documents/ULPGC/3º Año/1º "
                                         "Semestre/AP/Practicas/Examen Python/Mochila 0/DropHive/BaseDatos/DropHive.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)


@app.route("/products")
def getProducts():
    try:
        productos = Productos.query.all()
        toReturn = [producto.serialize() for producto in productos]
        return jsonify(toReturn), 200, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception:
        exception("Server error ->")
        return jsonify({"a ocurrido un error"}), 500


# @app.route("/product", method=['GET'])
# def addProduct():
# name = request.args
# id = db.Column(Integer, primary_key=True, autoincrement=True)
# name = db.Column(String, nullable=False)
# description = db.Column(Text)
# precio = db.Column(Float, default=0.0)
# category_id = db.Column(Integer, ForeignKey('categorias.id'))
# descuento = db.Column(Float, default=0.0)
# size = db.Column(String)
# quantity = db.Column(Integer)
# categoria = relationship("Categoria", back_populates="productos")


if __name__ == "__main__":
    app.run(debug=True, port=4000)
