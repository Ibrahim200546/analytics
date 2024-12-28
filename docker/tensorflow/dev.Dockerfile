# Базовый образ Python 3
FROM python:3.11-slim

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    git \
    wget \
    curl \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/app

COPY ./tensorflow/requirements.txt /srv/app/requirements.txt

RUN cd /srv/app && pip install --upgrade pip && pip install -r requirements.txt

COPY ./tensorflow /srv/app

CMD ["python3", "server.py"]
