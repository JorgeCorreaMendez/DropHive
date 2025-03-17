from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import relationship
from BackEnd.models import db


class Privilege(db.Model):
    __tablename__ = 'privileges'

    id = db.Column(Integer, primary_key=True, autoincrement=True)
    name = db.Column(String, nullable=False)
    permissions = db.Column(Text)
    account = relationship("Account", back_populates="privilege_id")

    def __str__(self):
        return "{}, {}, {}, {}".format(self.id, self.name, self.permissions, self.account)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "permissions": self.permissions,
            "account": self.account
        }
