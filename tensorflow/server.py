#coding=utf-8

from flask import Flask, request, jsonify
from transformers import pipeline

# Инициализация Flask-приложения
app = Flask(__name__)

# Загрузка модели RuSentiment
sentiment_pipeline = pipeline("sentiment-analysis", model="blanchefort/rubert-base-cased-sentiment")

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the RuSentiment API!"})

@app.route("/analyze", methods=["POST"])
def analyze():
    # Получение текста из тела запроса
    data = request.json
    if not data or "text" not in data:
        return jsonify({"error": "Please provide a 'text' field in the request body"}), 400

    text = data["text"]

    # Анализ текста
    results = sentiment_pipeline([text])
    return jsonify(results[0])

# Запуск приложения на порту 8000
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)

