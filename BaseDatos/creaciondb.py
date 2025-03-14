import sqlite3 as sql
import os

DB_PATH = os.path.abspath(os.path.dirname(__file__))+'\DropHive.db'

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
                      category_id INTEGER NOT NULL REFERENCES categorias,
                      descuento FLOAT,
                      size TEXT,
                      quantity INTEGER);''')
    
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
                   privilegio INTEGER REFERENCES PRIVILEGIO);''')
    
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
        (1, "Camiseta", "Camiseta de manga larga", 19.99, 1, 0, "S,M,L,XL", 100),
        (2, "Pantalón", "Pantalón de cuero", 29.99, 1, 0, "M,L", 50),
    ]

    categorias = [
        (1, "Ropa", "Categoría de ropa"),
        (2, "Accesorios", "Categoría de accesorios"),
        (3, "Limpieza", "Categoría de limpieza")
    ]

    cuenta = [
        (1, "Administrador", "admin@example.com", "pbkdf2:sha256:150000$j3i32R78$528663f42787f02477271a493d7f53d1546925197b22882b6458944a8f117667", "+573161234567", "Administrador", "Calle 123, 456", 1),
        (2, "Usuario", "user@example.com", "pbkdf2:sha256:150000$j3i32R78$528663f42787f02477271a493d7f53d1546925197b22882b6458944a8f11", "+573161234567", "Administrador", "Calle 123, 456", 1)
    ]

    permisos = [
        (1, "Administrador", "Administrador del sistema"),
        (2, "Usuario", "Usuario normal"),
        (3, "Visitante", "Visitante del sistema")
    ]

    conn.executemany("""INSERT INTO productos VALUES (?, ?, ?, ?, ?, ?, ?, ?)""", productos)
    conn.executemany("""INSERT INTO categorias VALUES (?, ?, ?)""", categorias)
    conn.executemany("""INSERT INTO cuentas VALUES (?, ?, ?, ?, ?, ?, ?, ?)""", cuenta)
    conn.executemany("""INSERT INTO privilegios VALUES (?, ?, ?)""", permisos)



    conn.commit()
    conn.close()

if __name__ == "__main__":
    createDB()
    addValues()