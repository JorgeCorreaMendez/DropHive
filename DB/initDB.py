import sqlite3 as sql
import os
import CreacionBaseDatosCuentas
from BackEnd.utils.bcrypt_methods import create_hash

DB_PATH = os.path.abspath(os.path.dirname(__file__)) + '/DropHive.db'


def createDB(path):
    conn = sql.connect(path)
    cursor = conn.cursor()

    cursor.execute('''DROP TABLE IF EXISTS products''')
    cursor.execute('''DROP TABLE IF EXISTS categories''')
    cursor.execute('''DROP TABLE IF EXISTS privileges''')
    cursor.execute('''DROP TABLE IF EXISTS accounts''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS products
                     (product_id TEXT PRIMARY KEY, 
                      name TEXT NOT NULL, 
                      description TEXT,
                      price FLOAT,
                      discount FLOAT,
                      size TEXT,
                      quantity INTEGER,
                      category_id INTEGER NOT NULL,
                      FOREIGN KEY (category_id) REFERENCES categories(id));''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS categories
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      name TEXT NOT NULL UNIQUE, 
                      description TEXT);''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS accounts
                     (id INTEGER PRIMARY KEY AUTOINCREMENT,
                      name TEXT NOT NULL,
                      mail TEXT NOT NULL unique,
                      password TEXT NOT NULL,
                      phone TEXT,
                      description TEXT,
                      address TEXT,
                      privilege_id INTEGER,
                      FOREIGN KEY (privilege_id) REFERENCES privileges(id));''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS privileges
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      name TEXT NOT NULL UNIQUE,
                      permissions TEXT);''')

    conn.commit()
    conn.close()


def addValuesSample(path):
    conn = sql.connect(path)
    cursor = conn.cursor()

    products = [
        ("NAF1", "Camiseta", "Camiseta de manga larga", 19.99, 1, 0, "S,M,L,XL", 100),
        ("NAF2", "Pantalón", "Pantalón de cuero", 29.99, 1, 0, "M,L", 50),
    ]

    categories = [
        ("Ropa", "Categoría de ropa"),
        ("Accesorios", "Categoría de accesorios"),
        ("Limpieza", "Categoría de limpieza")
    ]

    accounts = [
        ("Administrador", "admin@DropHive.com",
         create_hash("1234"),
         "+573161234567", "Administrador", "Calle 123, 456", 1),
        ("Usuario", "user@DropHive.com",
         create_hash("user"), "+573161234567",
         "Administrador", "Calle 123, 456", 1)
    ]

    privileges = [
        ("Administrador", "Administrador del sistema"),
        ("Usuario", "Usuario normal"),
        ("Visitante", "Visitante del sistema")
    ]

    # Insertar valores
    cursor.executemany(
        """INSERT INTO products (product_id, name, description, price, category_id, discount, size, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        products)
    cursor.executemany("""INSERT INTO categories (name, description) VALUES (?, ?)""",
                       categories)
    cursor.executemany(
        """INSERT INTO accounts (name, mail, password, phone, description, address, privilege_id) VALUES (?, ?, ?, ?, ?, ?, ?)""",
        accounts)
    cursor.executemany("""INSERT INTO privileges (name, permissions) VALUES (?, ?)""",
                       privileges)

    conn.commit()
    conn.close()


if __name__ == "__main__":
    createDB(DB_PATH)
    addValuesSample(DB_PATH)
    CreacionBaseDatosCuentas.create_db_cuentas()
    CreacionBaseDatosCuentas.add_cuenta_nueva("admin@DropHive.com", "DropHive")
    CreacionBaseDatosCuentas.add_cuenta_nueva("user@DropHive.com", "DropHive")
