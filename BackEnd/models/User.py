from sqlalchemy import Column, String, Boolean

from BackEnd.models import UserBase


class User(UserBase):
    __tablename__ = 'users'
    mail = Column(String, primary_key=True)
    db_name = Column(String, nullable=False)
    first_login = Column(Boolean, nullable=False, default=True)

    def __str__(self):
        return f"{self.mail}, {self.db_name}"

    def serialize(self):
        return {
            "mail": self.mail,
            "db_name": self.db_name,
            "first_login": self.first_login
        }
