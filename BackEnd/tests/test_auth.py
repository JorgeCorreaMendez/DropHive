import json

def test_login_success(client):
    """Prueba de login con credenciales correctas"""
    response = client.post("/auth/login", json={"username": "admin", "password": "password123"})
    data = response.get_json()

    assert response.status_code == 200
    assert "access_token" in data  # Verifica que se devuelve un token

def test_login_fail(client):
    """Prueba de login con credenciales incorrectas"""
    response = client.post("/auth/login", json={"username": "admin", "password": "wrongpass"})
    data = response.get_json()

    assert response.status_code == 401
    assert data["msg"] == "Credenciales inválidas"
