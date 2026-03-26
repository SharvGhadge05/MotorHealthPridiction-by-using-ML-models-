from flask_cors import CORS
from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)
CORS(app)

# Load trained model
model = pickle.load(open("model.pkl", "rb"))

@app.route("/")
def home():
    return "API Running 🚀"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    temperature = data["temperature"]
    vibration = data["vibration"]
    rpm = data["rpm"]

    prediction = model.predict([[temperature, vibration, rpm]])

    return jsonify({
        "prediction": int(prediction[0])
    })
@app.route("/predict_csv", methods=["POST"])
def predict_csv():
    import pandas as pd

    file = request.files["file"]
    df = pd.read_csv(file)

    predictions = model.predict(df)
    df["prediction"] = predictions

    return df.to_json(orient="records")


if __name__ == "__main__":
    app.run(debug=True)