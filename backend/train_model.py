import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# Create dummy dataset
data = {
    "temperature": [30, 80, 60, 90, 40, 100, 35, 85],
    "vibration": [2, 8, 5, 9, 3, 10, 2, 7],
    "rpm": [1000, 3000, 2000, 3500, 1200, 4000, 1100, 3200],
    "failure": [0, 1, 0, 1, 0, 1, 0, 1]
}

df = pd.DataFrame(data)

X = df[["temperature", "vibration", "rpm"]]
y = df["failure"]

model = RandomForestClassifier()
model.fit(X, y)

# Save model
pickle.dump(model, open("model.pkl", "wb"))

print("Model trained and saved!")