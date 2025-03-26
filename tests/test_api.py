import json
import pytest
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../BackEnd")))
from app import app, db

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        with app.app_context():
            db.create_all()  # Asegura que la base de datos esté lista
        yield client  # Devuelve el cliente de pruebas
        with app.app_context():
            db.session.remove()
            db.drop_all()  # Limpia la base de datos después de la prueba

def test_index(client):
    response = client.get("/")
    assert response.status_code == 200
    assert b"API DropHive" in response.data

def test_register_success(client, mocker):
    """Prueba un registro exitoso de usuario"""
    user_data = {
        "name": "EmpresaTest",
        "mail": "empresa@test.com",
        "password": "securepassword",
        "phone": "123456789",
        "description": "Empresa de prueba",
        "address": "Calle Falsa 123",
        "privilege_id": 1
    }

    # Simulamos que la base de datos aún no existe para permitir el registro
    mocker.patch("os.path.exists", return_value=False)
    mocker.patch("DB.initDB.createDB")
    mocker.patch("DB.funcionesProductos.AddAccount", return_value=0)

    response = client.post("/register", json=user_data)

    assert response.status_code == 200
    assert b"La empresa no existe." in response.data


def test_register_existing_user(client, mocker):
    """Prueba el caso en el que el usuario ya existe"""
    user_data = {
        "name": "EmpresaTest",
        "mail": "empresa@test.com",
        "password": "securepassword",
        "phone": "123456789",
        "description": "Empresa de prueba",
        "address": "Calle Falsa 123",
        "privilege_id": 1
    }

    # Simulamos que el archivo de la base de datos ya existe
    mocker.patch("os.path.exists", return_value=True)

    response = client.post("/register", json=user_data)

    assert response.status_code == 401
    assert b"La empresa EmpresaTest ya existe." in response.data

# Test para agregar un producto exitosamente
def test_add_product_success(client):
    data = {
        "product_id": 1,
        "name": "Producto de prueba",
        "category_id": 2,
        "description": "Descripción de prueba",
        "price": 10.99,
        "discount": 0.1,
        "size": "M",
        "quantity": 5
    }
    response = client.post("/add_product", json=data)

    assert response.status_code == 200
    assert response.json["message"] == "Producto añadido correctamente"

# Test para manejar errores al agregar un producto
def test_add_product_error(client, mocker):
    mocker.patch("app.AddProduct", return_value=1)  # Simula un error en la función

    data = {
        "product_id": 2,
        "name": "Producto fallido",
        "description": "Descripción errónea",
        "price": 5.99,
        "discount": 0.05,
        "size": "L",
        "quantity": 3
    }
    response = client.post("/add_product", json=data)

    assert response.status_code == 400
    assert response.json["error"] == "Error al añadir el producto."
