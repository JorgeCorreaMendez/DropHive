import sqlite3 as sql
import os

DB_PATH = os.path.abspath(os.path.dirname(__file__)) + '/DropHive.db'

def createDB():
    conn = sql.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute('''DROP TABLE IF EXISTS productos''')
    cursor.execute('''DROP TABLE IF EXISTS categorias''')
    cursor.execute('''DROP TABLE IF EXISTS privilegios''')
    cursor.execute('''DROP TABLE IF EXISTS cuentas''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS productos
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      name TEXT NOT NULL, 
                      description TEXT,
                      precio FLOAT,
                      category_id INTEGER NOT NULL,
                      descuento FLOAT,
                      size TEXT,
                      quantity INTEGER,
                      FOREIGN KEY (category_id) REFERENCES categorias(id));''')
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS categorias
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      name TEXT NOT NULL UNIQUE, 
                      descripcion TEXT);''')
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS cuentas
                     (id INTEGER PRIMARY KEY AUTOINCREMENT,
                      nombre TEXT NOT NULL,
                      correo TEXT NOT NULL unique,
                      contraseña_hash TEXT NOT NULL,
                      tlf TEXT,
                      descripcion TEXT,
                      direccion TEXT,
                      privilegio_id INTEGER,
                      FOREIGN KEY (privilegio_od) REFERENCES privilegios(id));''')
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS privilegios
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      nombre TEXT NOT NULL UNIQUE,
                      permisos TEXT);''')

    conn.commit()
    conn.close()

def addValues():
    conn = sql.connect(DB_PATH)
    cursor = conn.cursor()

    productos = [
        ("Camiseta", "Camiseta de manga larga", 19.99, 1, 0, "S,M,L,XL", 100),
        ("Pantalón", "Pantalón de cuero", 29.99, 1, 0, "M,L", 50),
    ]

    categorias = [
        ("Ropa", "Categoría de ropa"),
        ("Accesorios", "Categoría de accesorios"),
        ("Limpieza", "Categoría de limpieza")
    ]

    cuentas = [
        ("Administrador", "admin@example.com", "pbkdf2:sha256:150000$j3i32R78$528663f42787f02477271a493d7f53d1546925197b22882b6458944a8f117667", "+573161234567", "Administrador", "Calle 123, 456", 1),
        ("Usuario", "user@example.com", "pbkdf2:sha256:150000$j3i32R78$528663f42787f02477271a493d7f53d1546925197b22882b6458944a8f11", "+573161234567", "Administrador", "Calle 123, 456", 1)
    ]

    privilegios = [
        ("Administrador", "Administrador del sistema"),
        ("Usuario", "Usuario normal"),
        ("Visitante", "Visitante del sistema")
    ]

    # Insertar valores
    cursor.executemany("""INSERT INTO productos (name, description, precio, category_id, descuento, size, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)""", productos)
    cursor.executemany("""INSERT INTO categorias (name, descripcion) VALUES (?, ?)""", categorias)
    cursor.executemany("""INSERT INTO cuentas (nombre, correo, contraseña_hash, tlf, descripcion, direccion, privilegio) VALUES (?, ?, ?, ?, ?, ?, ?)""", cuentas)
    cursor.executemany("""INSERT INTO privilegios (nombre, permisos) VALUES (?, ?)""", privilegios)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    createDB()
    addValues()
