def obtenerDatosRegistro(data):
    name = data['name']
    mail = data['mail']
    password = data['password']
    phone = data.get('phone', None)
    description = data.get('description', None)
    address = data.get('address', None)
    privilege_id = data.get('privilege_id', None)
    return name, mail, password, phone, description, address, privilege_id

def obtenerDatosProducto(data):
    name = data['name']
    category_id = data['category_id']
    price = data.get('price', None)
    description = data.get('description', None)
    discount = data.get('discount', None)
    size = data.get('size', None)
    quantity = data.get('quantity', None)
    return name, category_id, description, price, discount, size, quantity