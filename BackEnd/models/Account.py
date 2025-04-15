from BackEnd.models import db


class Account(db.Model):
    __tablename__ = 'accounts'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    mail = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    phone = db.Column(db.Text)
    description = db.Column(db.Text)
    address = db.Column(db.Text)

    privilege_id = db.Column(db.Integer, db.ForeignKey('privileges.id'))
    privileges = db.relationship("Privilege", back_populates="account")

    def __str__(self):
        return f"{self.id}, {self.name}, {self.mail}, {self.password}, {self.phone}, {self.description}, {self.address}, {self.privileges}, {self.privilege_id}"

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
