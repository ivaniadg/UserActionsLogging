from flask.cli import FlaskGroup

from app import app, db


cli = FlaskGroup(app)


@cli.command("create_db")
def create_db():
    print(db.drop_all())
    print(db.create_all())
    print(db.session.commit())


@cli.command("start")
def start():
    app.run(host=app.config['HOST'],
            port=app.config['PORT'])


if __name__ == "__main__":
    cli()
