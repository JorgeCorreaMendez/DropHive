from sqlalchemy import Integer, String, Text, Column
from sqlalchemy.orm import relationship
from BackEnd.models import Base


class Privilege(Base):
    __tablename__ = 'privileges'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    permissions = Column(Text)
    account = relationship("Account", back_populates="privileges")

    def __str__(self):
        return "{}, {}, {}, {}".format(self.id, self.name, self.permissions, self.account)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "permissions": self.permissions,
        }
