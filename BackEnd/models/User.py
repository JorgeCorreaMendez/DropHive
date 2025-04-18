from sqlalchemy import Column, String
from sqlalchemy.orm import declarative_base
from BackEnd.utils.sqlalchemy_methods import get_engine

UserBase = declarative_base()


class User(UserBase):
    __tablename__ = 'users'
    mail = Column(String, primary_key=True)
    db_name = Column(String, nullable=False)

    def __str__(self):
        return f"{self.mail}, {self.db_name}"

    def serialize(self):
        return {
            "mail": self.mail,
            "db_name": self.db_name
        }


def init_user_db():
    UserBase.metadata.create_all(get_engine("Users"))
