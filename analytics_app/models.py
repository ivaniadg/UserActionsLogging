from sqlalchemy import Column, Integer, String, JSON
from app.app import db


class ActionRAW(db.Model):
    __tablename__ = 'actions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    data = Column(JSON)


class Position(db.Model):
    __tablename__ = 'position'

    id = Column(Integer, primary_key=True, autoincrement=True)
    screen_x = Column(Integer)
    screen_y = Column(Integer)
    name = Column(String)
    timestamp = Column(Integer)
    user = Column(String)
    condition1 = Column(String)
    condition2 = Column(String)

    def __repr__(self):
        return f"{self.user} - {self.name} - {self.timestamp}"
