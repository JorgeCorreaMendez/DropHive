import pytest
from app import app, db
from models import Category, Item

@pytest.fixture
def client():
    """Crea un cliente de prueba con una base de datos en memoria."""
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"  # Base de datos en RAM
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "testsecret"

    with app.test_client() as client:
        with app.app_context():
            db.create_all()  # Crea las tablas en la BD de prueba
            yield client  # Retorna el cliente para hacer pruebas
            db.session.remove()
            db.drop_all()  # Borra las tablas después del test
