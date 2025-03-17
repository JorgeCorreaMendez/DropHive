from sqlalchemy import Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from BackEnd.models import db
from BackEnd.models.Privilege import Privilege


class Account(db.Model):
    __tablename__ = 'accounts'

    id = db.Column(Integer, primary_key=True, autoincrement=True)
    name = db.Column(String, nullable=False)
    mail = db.Column(String, unique=True, nullable=False)
    password = db.Column(String, nullable=False)
    phone = db.Column(Text)
    description = db.Column(Text)
    address = db.Column(Text)
    privilege = db.Column(Integer, ForeignKey('privileges.id'))
    privilege_id = relationship("Privilege", back_populates="account")

    def __str__(self):
        return "{}, {}, {}, {}, {}, {}, {}, {}, {}".format(
            self.id, self.name, self.mail, self.password,
            self.phone, self.description, self.address, self.privilege,
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
            "privilege": self.privilege,
            "privilege_id": self.privilege_id
        }
