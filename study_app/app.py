from flask import Flask, make_response, request, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from functools import wraps, update_wrapper
from flask_cors import CORS
from celery import Celery
from app.models import ActionRAW, Position


app = Flask(__name__)
app.config.from_object("config")
app.secret_key = app.config['SECRET_KEY']

CORS(app)
db = SQLAlchemy(app)

task_broker = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
task_broker.conf.update(app.config)


def nocache(view):
    @wraps(view)
    def no_cache(*args, **kwargs):
        response = make_response(view(*args, **kwargs))
        response.headers['Last-Modified'] = datetime.now()
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '-1'
        return response

    return update_wrapper(no_cache, view)


@app.route('/')
@nocache
def index():
    return render_template("index.html")


@app.route("/analytics", methods=["POST"])
@nocache
def save_analytics():
    data = request.get_json()
    process_actions.apply_async(data)
    return make_response('Received', 200)


@task_broker.task
def process_actions(data):
    raw_actions = []
    interest = []
    for action in data:
        # First: save the raw json.
        raw = ActionRAW(action)
        # Second: save the transformed action for analysis
        position = Position(screen_x=action['screen_x'],
                            screen_y=action['screen_y'],
                            user=action['user'],
                            condition1=action['condition1'],
                            condition2=action['condition2'],
                            name=action['name'],
                            timestamp=action['timestamp'])
        raw_actions.append(raw)
        interest.append(position)

    db.session.add_all(raw_actions)
    db.session.commit()

    db.session.add_all(interest)
    db.session.commit()


if __name__ == '__main__':
    app.run()
