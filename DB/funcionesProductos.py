import sqlite3 as sql
import os


def AddAccount(path, name, mail, password, phone=None, description=None, address=None, privilege_id=None):
    conn = sql.connect(path)
    cursor = conn.cursor()

    cursor.execute('''INSERT INTO accounts (name, mail, password, phone, description, address, privilege_id) VALUES (?,?,?,?,?,?,?)''', (name, mail, password, phone, description, address, privilege_id))
    conn.commit()
    conn.close()

def AddProduct(path, product_id, name, category_id, description=None, price=None, discount=None, size=None, quantity=None):
    try:
        rows = buscarProducto(path, product_id)
        conn = sql.connect(path)
        cursor = conn.cursor()
        if not rows:
            cursor.execute('''INSERT INTO products (product_id, name, category_id, description, price, discount, size, quantity) VALUES (?,?,?,?,?,?,?,?)''', (product_id, name, category_id, description, price, discount, size, quantity))
            conn.commit()
            return 0
        else:
            return 1
    except Exception as e:
        print("Error: ", e)
        return -1
    finally:
        conn.close()

def buscarProducto(path, product_id=None, name=None, category_id=None):
    conn = sql.connect(path)
    cursor = conn.cursor()
    print(name)
    if product_id:
        cursor.execute('''SELECT * FROM products WHERE product_id = ?''', (str(product_id),))
    elif name:
        cursor.execute('''SELECT * FROM products WHERE name = ?''', (str(name),))
    elif category_id:
        cursor.execute('''SELECT * FROM products WHERE category_id =?''', (int(category_id),))
    else:
        return None
    rows = cursor.fetchall()
    print(rows)
    conn.close()
    return rows if rows else []
