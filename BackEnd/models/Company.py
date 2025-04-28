from sqlalchemy import Integer, String, Column, Text
from sqlalchemy.orm import relationship
from BackEnd.models import Base


# TODO. añadir descripción
class Company(Base):
    __tablename__ = 'companies'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    profile_picture = Column(String(255))
    accounts = relationship('Account', back_populates='company')

    def __str__(self):
        return "{}, {}, {}".format(self.id, self.name, self.profile_picture)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "profile_picture": self.profile_picture,
            "accounts": [account.serialize() for account in self.accounts] if self.accounts else []
        }
