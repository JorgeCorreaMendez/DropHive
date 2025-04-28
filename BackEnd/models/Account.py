from sqlalchemy import Integer, String, Text, ForeignKey, Column
from sqlalchemy.orm import relationship

from BackEnd.models import Base


# TODO. eliminar privilege_id y company_id
# TODO. cambiar descripción, no tiene sentido
class Account(Base):
    __tablename__ = 'accounts'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    mail = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    phone = Column(Text)
    description = Column(Text)
    address = Column(Text)
    privileges = relationship("Privilege", back_populates="account")
    privilege_id = Column(Integer, ForeignKey('privileges.id'))
    company_id = Column(Integer, ForeignKey('companies.id'))
    company = relationship('Company', back_populates='accounts')

    def __str__(self):
        return "{}, {}, {}, {}, {}, {}, {}, {}, {}, {}".format(
            self.id, self.name, self.mail, self.password,
            self.phone, self.description, self.address, self.privileges,
            self.privilege_id, self.company_id
        )


def serialize(self):
    return {
        "id": self.id,
        "name": self.name,
        "mail": self.mail,
        "password": self.password,
        "phone": self.phone,
        "description": self.description,
        "address": self.address,
        "privileges": [p.serialize() for p in self.privileges] if self.privileges else [],
        "privilege_id": self.privilege_id,
        "company_id": self.company_id,
        "company": {
            "id": self.company.id,
            "name": self.company.name
        } if self.company else None
    }
