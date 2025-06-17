from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np

app = Flask(__name__)

# Load your trained model
model = joblib.load('random_forest_fraud_model.pkl')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        distance = 0.0  # If your model requires distance, set it as needed

        features = [
            float(data['Transaction_Amount']),
            int(data['Transaction_Type']),
            float(data['Account_Balance']),
            int(data['Device_Type']),
            int(data['Previous_Fraudulent_Activity']),
            int(data['Daily_Transaction_Count']),
            float(data['Avg_Transaction_Amount_7d']),
            int(data['Failed_Transaction_Count_7d']),
            int(data['Card_Type']),
            distance,
            int(data['Authentication_Method']),
            int(data['Is_Weekend']),
            int(data['Year']),
            int(data['Month']),
            int(data['Day']),
            int(data['Hour']),
            int(data['Minute']),
            int(data['Second']),
            int(data['IP_Address_Flag'])
        ]

        proba = model.predict_proba([features])[0]
        fraud_prob = proba[1]
        is_fraud = fraud_prob > 0.5

        return jsonify({
            'prediction': 'Fraudulent' if is_fraud else 'Safe',
            'confidence': round((fraud_prob if is_fraud else 1 - fraud_prob) * 100, 2),
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
