# UserActionsLogging
An example app for user actions' logging. To run it, you need docker compose.

## How to run it?
1. Create the env files. There are three: 
    - analytics_app/.env
        ```shell script
        SECRET_KEY='anythingwithnumbers1231'
        # If you change the ports in the docker compose you should change them here too
        CELERY_BROKER_URL='redis://redis:6379/0' 
        CELERY_RESULT_BACKEND='redis://redis:6379/0'
        # Keep as secret. If you do not want to use the postgres container and want to use a local db,
        # you have to check what the host direction should be.
        DB_USER=user
        DB_PASS=user_pass
        DB_NAME=example
        DB_HOST=db
        DB_PORT=5432
        # There's no need to change these but if you do make sure you 
        # apply that change to the other files too
        HOST='0.0.0.0'
        PORT=5000
        ```
   
    - study_app/.env
   
       ``` shell script
       # There's no need to change these but if you do make sure you 
       # apply that change to the other files too
       HOST='0.0.0.0'
       PORT=5000
       ```
   
    - postgres.env
       ```shell script
       # These should be the same as in analytics_app
       POSTGRES_USER=user
       POSTGRES_PASSWORD=user_pass
       POSTGRES_DB=example
       ```

2. Create and run the containers
    ```shell script
    docker-compose build
    docker-compose up
    ```

3. Create the db
```shell script
docker-compose run analytics_app python manage.py create_db
```

## Architecture

There are 5 services running

### 1. Study app
The app that you want to test. If you want to use this as template, this folder should have the app that you are studying. 
The only file you should keep is the `UserLogger.js` to log the actions in your app.

### 2. Analytics app
The API that will receive the actions that you are logging. This app will create the `celery` tasks and put them in `redis`.

### 3. Celery
The task broker that will execute the data processing. This app is the same analytics app but running with another interpreter.
This process will transform the raw actions from the user interface and put them in a database that you can use to analyze the results. 
This code should change according to the analysis you want to make, you can add other models (=other tables in the database) to save the data in the easiest format.  

### 4. Redis
The queue that will have all the tasks that will be processed.

### 5. DB
A postgres database that will store the processed data. In this example it only has two tables: `rawActions` and `PositionsScren`. The `rawActions` table has the actions as they arrived from the user interface.
The table `PositionScren` is storing the mouse position for each action with a timestamp. This data could be used to understand where on the screen the user is interacting and also to know how the user moves around the app.

