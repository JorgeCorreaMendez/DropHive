import bcrypt


def create_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())


def verify_hash(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)
