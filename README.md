# Motor Health Prediction AI

Motor Health Prediction AI is a full-stack web application designed to monitor and predict motor component failures using Machine Learning (Random Forest Classifier). The system accepts input parameters such as temperature, vibration, and RPM, and returns a prediction regarding potential motor failure. It supports both single predictions and bulk predictions via CSV upload.

## Features

- **Single Prediction**: Input specific motor metrics (Temperature, Vibration, RPM) directly on the web interface to get an instant failure prediction.
- **Bulk Upload**: Upload a CSV file with historical or bulk motor data to receive predictions for all entries at once.
- **Machine Learning**: Uses a trained `RandomForestClassifier` from `scikit-learn` for accurate failure predictions based on the input dataset.

## Tech Stack

**Frontend:**
- React.js
- HTML/CSS (Responsive Design)
- Fetch API for communicating with the backend

**Backend:**
- Python 3.x
- Flask (REST API)
- Flask-CORS (Cross-Origin Resource Sharing)
- scikit-learn (Machine Learning Model)
- pandas (Data manipulation for CSV processing)
- pickle (Model serialization)

## Project Structure

```
motor-ai-project/
│
├── backend/                  # Flask REST API and ML Model
│   ├── app.py                # Main Flask application and API routes
│   ├── train_model.py        # Script to train the Random Forest model
│   ├── model.pkl             # Serialized (trained) ML model
│   ├── requirements.txt      # Python dependencies
│   └── test_api.py           # Unit tests for the API
│
├── frontend/                 # React UI app
│   ├── src/                  # React source code (components, styles, App.js)
│   ├── public/               # Public static assets
│   └── package.json          # Node.js dependencies and scripts
│
├── Dataset/                  # Datasets and sample files
│   └── sample.csv            # Sample CSV file for testing Bulk Upload
│
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (for the React Frontend)
- [Python 3.x](https://www.python.org/) (for the Flask Backend)

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # Activate on Windows:
   venv\Scripts\activate
   # Activate on macOS/Linux:
   source venv/bin/activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. (Optional) Retrain the model if you'd like to update `model.pkl`:
   ```bash
   python train_model.py
   ```

5. Start the Flask server:
   ```bash
   python app.py
   ```
   The backend will be running at `http://127.0.0.1:5000/`.

### 2. Frontend Setup

1. Open a new, separate terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will be running at `http://localhost:3000/`.

## API Endpoints

The Flask backend exposes the following endpoints:

- `GET /`
  Health check to ensure the API is running. Returns `"API Running 🚀"`.

- `POST /predict`
  Accepts a JSON payload with features and returns a failure prediction.
  - **Body Example:** `{"temperature": 80, "vibration": 7, "rpm": 3000}`
  - **Response Example:** `{"prediction": 1}` (where 1 indicates failure, 0 indicates normal).

- `POST /predict_csv`
  Accepts a `multipart/form-data` request containing a CSV file (`file`) with headers `temperature,vibration,rpm`. Returns the same dataset padded with a new `prediction` column in JSON or CSV format.

## Usage

1. Start both the backend and frontend servers.
2. Visit `http://localhost:3000/` in your browser.
3. To make a **Single Prediction**, enter the Temperature, Vibration, and RPM in the respective input fields and submit.
4. To test **Bulk Upload**, upload the `Dataset/sample.csv` file using the upload feature in the React app to see bulk predictions.
