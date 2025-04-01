import sqlite3 as sql
import os


global DB_PATH_USUARIOS
DB_PATH_USUARIOS= os.path.abspath(os.path.dirname(__file__)) + '/Redireccion.db'

def create_db_cuentas():
    global DB_PATH_USUARIOS
    conn = sql.connect(DB_PATH_USUARIOS)
    cursor = conn.cursor()

    cursor.execute('''CREATE TABLE IF NOT EXISTS Usuarios
                    (correo TEXT PRIMARY KEY,
                     db_name TEXT NOT NULL);''')


    conn.commit()
    conn.close()


def search_cuenta(correo):
    global DB_PATH_USUARIOS

    conn = sql.connect(DB_PATH_USUARIOS)
    cursor = conn.cursor()

    cursor.execute('''SELECT db_name FROM Usuarios WHERE correo = ?''', (str(correo),))

    db = cursor.fetchone()
    conn.commit()
    conn.close()
    return db[0] if db else None

def add_cuenta_nueva(correo, db_name):
    global DB_PATH_USUARIOS
    conn = sql.connect(DB_PATH_USUARIOS)
    cursor = conn.cursor()
    estado = True
    try:
        cursor.execute('''INSERT INTO Usuarios (correo, db_name) VALUES (?, ?)''', (correo, db_name))
        conn.commit()
    except sql.Error as e:
        print('Error %s' % e)
        estado = False
    finally:
        conn.close()

    return estado


