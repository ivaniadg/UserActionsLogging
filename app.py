from flask import Flask, make_response, request, render_template
import json
from datetime import datetime
from functools import wraps, update_wrapper
from flask_cors import CORS
from celery import Celery


app = Flask(__name__)
app.config.from_object("config")
app.secret_key = app.config['SECRET_KEY']
CORS(app)


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
def process_actions():
    # TODO: expand json and put in db
    pass


if __name__ == '__main__':
    app.run()
