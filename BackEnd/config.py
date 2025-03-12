class Config:
    SECRET_KEY = "llavesecretaDropHive"
    SQLALCHEMY_DATABASE_URI = "sqlite:///../BaseDatos/DropHive.db"  # Ubicación en la carpeta BaseDatos
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "jwtsecretkey"
