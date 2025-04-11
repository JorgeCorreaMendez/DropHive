import sqlite3
import os
import pytest
from DB.initDB import createDB, addValuesSample, DB_PATH

# Ruta temporal de prueba para evitar afectar la base de datos real
TEST_DB_PATH = os.path.join(os.path.dirname(__file__), "test_DropHive.db")

@pytest.fixture
def setup_database():
    """ Configura la base de datos de prueba antes de cada test """
    createDB(TEST_DB_PATH)
    addValuesSample(TEST_DB_PATH)
    yield
    os.remove(TEST_DB_PATH)  # Elimina la base de datos después del test

def test_tables_exist(setup_database):
    """ Verifica que las tablas se crean correctamente """
    conn = sqlite3.connect(TEST_DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = {row[0] for row in cursor.fetchall()}

    expected_tables = {"productos", "categorias", "cuentas", "privilegios"}
    assert expected_tables.issubset(tables)

    conn.close()

def test_inserted_data(setup_database):
    """ Verifica que los datos se han insertado correctamente """
    conn = sqlite3.connect(TEST_DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM products;")
    assert cursor.fetchone()[0] > 0  # Debe haber productos

    cursor.execute("SELECT COUNT(*) FROM categories;")
    assert cursor.fetchone()[0] > 0  # Debe haber categorías

    cursor.execute("SELECT COUNT(*) FROM accounts;")
    assert cursor.fetchone()[0] > 0  # Debe haber cuentas

    cursor.execute("SELECT COUNT(*) FROM privileges;")
    assert cursor.fetchone()[0] > 0  # Debe haber privilegios

    conn.close()
