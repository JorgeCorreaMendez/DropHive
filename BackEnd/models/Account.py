from sqlalchemy import Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from models import db

class Account(db.Model):
    __tablename__ = 'accounts'

    id = db.Column(Integer, primary_key=True, autoincrement=True)
    name = db.Column(String, nullable=False)
    mail = db.Column(String, unique=True, nullable=False)
    password = db.Column(String, nullable=False)
    phone = db.Column(Text)
    description = db.Column(Text)
    address = db.Column(Text)
    privileges = relationship("Privilege", back_populates="account")
    privilege_id = db.Column(Integer, ForeignKey('privileges.id'))

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
