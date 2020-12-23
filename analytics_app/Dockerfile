FROM python:3.6.5

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "manage.py" ,"run", "-h", "0.0.0.0"]