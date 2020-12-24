from flask import Flask, make_response, request
from flask_sqlalchemy import SQLAlchemy
from celery import Celery
import logging
import json
# APP
app = Flask(__name__)
app.config.from_object("config")
app.secret_key = app.config['SECRET_KEY']

# DB
db = SQLAlchemy(app)

# Task Broker
task_broker = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
task_broker.conf.update(app.config)

from models import ActionRAW, PositionScreen


@app.route("/analytics", methods=["POST"])
def save_analytics():
    data = request.get_json()
    process_actions.apply_async(args=(data, ))
    return make_response('Received', 200)


@task_broker.task(bind=True, name='process_actions')
def process_actions(self, data):
    interest = []
    for action in data:
        # First: save the raw json.
        raw = ActionRAW(data=action)
        db.session.add(raw)
        db.session.commit()
        # Second: save the transformed action for analysis
        position = PositionScreen(raw_action=raw.id,
                            screen_x=action['screen_x'],
                            screen_y=action['screen_y'],
                            user=action['user'],
                            condition_1=action['condition_1'],
                            condition_2=action['condition_2'],
                            name=action['name'],
                            timestamp=action['timestamp'])
        interest.append(position)

    db.session.add_all(interest)
    db.session.commit()