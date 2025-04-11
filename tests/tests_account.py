import pytest
from flask import session
from BackEnd.routes.Accounts import accounts_bp
from BackEnd.models.Account import Account
from BackEnd.utils.bcrypt_methods import create_hash
from flask import Flask

# App de prueba
@pytest.fixture
def app():
    app = Flask(__name__)
    app.secret_key = "test_secret"
    app.register_blueprint(accounts_bp, url_prefix="/api")
    return app

@pytest.fixture
def client(app):
    return app.test_client()

# Test para GET /accounts
def test_get_accounts_success(monkeypatch, client):
    def mock_get_all_values_from(model, dbname):
        return [{"id": 1, "mail": "test@mail.com"}]

    monkeypatch.setattr("BackEnd.routes.Accounts.get_all_values_from", mock_get_all_values_from)

    with client.session_transaction() as sess:
        sess["user_id"] = 1  # Simula login

    response = client.get("/api/DropHive/accounts")
    assert response.status_code == 200
    assert response.is_json
    assert response.json == [{"id": 1, "mail": "test@mail.com"}]

# Test cuando falta el código de verificación
def test_change_password_no_code(client):
    response = client.post("/api/change_password", json={
        "code": "1234",
        "mail": "test@mail.com",
        "password": "newpassword"
    })
    assert response.status_code == 400
    assert response.json["error"] == "Código de verificación no encontrado o expirado."

# Test cuando el código es incorrecto
def test_change_password_invalid_code(client):
    with client.session_transaction() as sess:
        sess["verification_code"] = "0000"

    response = client.post("/api/change_password", json={
        "code": "9999",
        "mail": "test@mail.com",
        "password": "newpassword"
    })
    assert response.status_code == 400
    assert response.json["error"] == "El código de validación no es correcto"
