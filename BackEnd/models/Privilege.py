from BackEnd.models import db


class Privilege(db.Model):
    __tablename__ = 'privileges'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    permissions = db.Column(db.Text)

    account = db.relationship("Account", back_populates="privileges")

    def __str__(self):
        return f"{self.id}, {self.name}, {self.permissions}, {self.account}"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "permissions": self.permissions,
        }
