import os
import dotenv

dotenv.load_dotenv()

SEND_FILE_MAX_AGE_DEFAULT = 0
SECRET_KEY = os.getenv('SECRET_KEY')
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')