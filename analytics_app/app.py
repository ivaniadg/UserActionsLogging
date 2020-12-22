from flask import Flask, make_response, request, render_template
from flask_sqlalchemy import SQLAlchemy
from celery import Celery
# from models import ActionRAW, Position


app = Flask(__name__)
app.config.from_object("config")
app.secret_key = app.config['SECRET_KEY']

db = SQLAlchemy(app)

task_broker = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
task_broker.conf.update(app.config)


@app.route("/analytics", methods=["POST"])
def save_analytics():
    data = request.get_json()
    process_actions.apply_async(args=(data, ))
    return make_response('Received', 200)


@task_broker.task(bind=True, name='process_actions')
def process_actions(self, data):
    print(data)
    # raw_actions = []
    # interest = []
    # for action in data:
    #     # First: save the raw json.
    #     raw = ActionRAW(action)
    #     # Second: save the transformed action for analysis
    #     position = Position(screen_x=action['screen_x'],
    #                         screen_y=action['screen_y'],
    #                         user=action['user'],
    #                         condition1=action['condition1'],
    #                         condition2=action['condition2'],
    #                         name=action['name'],
    #                         timestamp=action['timestamp'])
    #     raw_actions.append(raw)
    #     interest.append(position)
    #
    # db.session.add_all(raw_actions)
    # db.session.commit()
    #
    # db.session.add_all(interest)
    # db.session.commit()


if __name__ == '__main__':
    app.run(host=app.config['HOST'],
            port=app.config['PORT'])
