import os
import dotenv

dotenv.load_dotenv()

SEND_FILE_MAX_AGE_DEFAULT = 0
SECRET_KEY = os.getenv('SECRET_KEY')
