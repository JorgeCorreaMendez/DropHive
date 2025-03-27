from sqlalchemy import Integer, String, Text, ForeignKey, Column
from sqlalchemy.orm import relationship

from BackEnd.models import Base


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

    def __str__(self):
        return "{}, {}, {}, {}, {}, {}, {}, {}, {}".format(
            self.id, self.name, self.mail, self.password,
            self.phone, self.description, self.address, self.privileges,
            self.privilege_id
        )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "mail": self.mail,
            "phone": self.phone,
            "description": self.description,
            "address": self.address,
            "privilege": self.privileges.serialize() if self.privileges else None,
            "privilege_id": self.privilege_id
        }
