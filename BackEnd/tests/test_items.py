import json

def test_create_item(client):
    """Prueba la creación de un artículo"""
    # Primero, creamos una categoría para asociarla al artículo
    client.post("/categories/", json={"name": "Ropa"})

    # Ahora, creamos el artículo
    response = client.post("/items/", json={
        "name": "Camiseta",
        "price": 19.99,
        "category_id": 1
    })
    data = response.get_json()

    assert response.status_code == 201
    assert data["msg"] == "Artículo creado"

def test_get_items(client):
    """Prueba obtener la lista de artículos"""
    response = client.get("/items/")
    data = response.get_json()

    assert response.status_code == 200
    assert isinstance(data, list)  # Verifica que devuelve una lista
