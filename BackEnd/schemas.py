from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# Esquema para el registro de usuario
class UserRegisterSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    mail: EmailStr
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    privilege_id: Optional[int] = 1

# Esquema para el inicio de sesión
class UserLoginSchema(BaseModel):
    mail: EmailStr
    password: str = Field(..., min_length=6)

# Esquema para agregar un producto
class ProductSchema(BaseModel):
    product_id: str = Field(..., max_length=5)
    name: str = Field(..., min_length=2, max_length=100)
    category_id: int
    description: Optional[str] = None
    price: Optional[float] = None
    discount: Optional[float] = None
    size: Optional[str] = None
    quantity: Optional[int] = None
