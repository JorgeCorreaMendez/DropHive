from sqlalchemy import Column, String

from BackEnd.models import Base


class User(Base):
    __tablename__ = 'users'
    mail = Column(String, primary_key=True)
    db_name = Column(String,  nullable=False)

    def __str__(self):
        return "{}, {}".format(
            self.mail, self.db_name
        )

    def serialize(self):
        return {
            "mail": self.mail,
            "db_name": self.db_name
        }
