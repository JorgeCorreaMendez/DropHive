import pytest
from flask import json
from BackEnd.app import app


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index(client):
    """Verificamos que la ruta de inicio carga correctamente"""
    response = client.get("/")
    assert response.status_code == 200
    assert b"API DropHive" in response.data

def test_register(client):
    """Prueba el registro de una nueva empresa"""
    data = {
        "name": "TestCompany",
        "mail": "test@example.com",
        "password": "securepassword",
        "phone": "123456789",
        "description": "Empresa de prueba",
        "address": "Calle 123",
        "privilege_id": 1
    }
    response = client.post("/register", json=data)
    assert response.status_code in [200, 401]  # 200 si se crea, 401 si ya existe

def test_search_product(client):
    """Prueba la búsqueda de productos por ID"""
    response = client.get("/search_product?id=1")
    assert response.status_code == 200
    assert response.is_json
    assert isinstance(response.json, list)  # Debe devolver una lista de productos
