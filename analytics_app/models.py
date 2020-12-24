from sqlalchemy import Column, Integer, String, JSON, BigInteger, ForeignKey
from app import db


class ActionRAW(db.Model):
    __tablename__ = 'actions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    data = Column(JSON)


class PositionScreen(db.Model):
    __tablename__ = 'positions_screen'

    id = Column(Integer, primary_key=True, autoincrement=True)
    raw_action = Column(Integer, ForeignKey('actions.id'))
    screen_x = Column(Integer)
    screen_y = Column(Integer)
    name = Column(String)
    timestamp = Column(BigInteger)
    user = Column(String)
    condition_1 = Column(String)
    condition_2 = Column(String)

    def __repr__(self):
        return f"{self.user} - {self.name} - {self.timestamp}"
