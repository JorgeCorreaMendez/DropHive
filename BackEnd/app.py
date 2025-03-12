from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from db import db
from routes import register_routes

app = Flask(__name__)
app.config.from_object(Config)

# Inicializar extensiones
db.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)
CORS(app)

# Registrar rutas
register_routes(app)

if __name__ == "__main__":
    app.run(debug=True)
