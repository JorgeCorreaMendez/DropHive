from sqlalchemy import Integer, String, ForeignKey, Column
from sqlalchemy.orm import relationship

from BackEnd.models import Base


# TODO. eliminar privilege_id y company_id
class Account(Base):
    __tablename__ = 'accounts'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    mail = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    phone = Column(String)
    address = Column(String)
    privileges = relationship("Privilege", back_populates="account")
    privilege_id = Column(Integer, ForeignKey('privileges.id'))
    company_id = Column(Integer, ForeignKey('companies.id'))
    company = relationship('Company', back_populates='accounts')

    def _str_(self):
        return "{}, {}, {}, {}, {}, {}, {}, {}, {}".format(
            self.id, self.name, self.mail, self.password,
            self.phone, self.address, self.privileges,
            self.privilege_id, self.company_id
        )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "mail": self.mail,
            "phone": self.phone,
            "address": self.address,
            "privileges": self.privileges.serialize() if self.privileges else None,
            "privilege_id": self.privilege_id,
            "company_id": self.company_id,
            "company": {
                "id": self.company.id,
                "name": self.company.name
            } if self.company else None
        }