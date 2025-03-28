import bcrypt


def creacion_hash(password):
    # Generar un salt y luego hacer el hash de la contraseña
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed


def verificar_hash(password, hashed_password):
    # Verificar que la contraseña coincida con el hash guardado
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)
