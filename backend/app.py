from pathlib import Path
import json
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from preprocessing import prepare_features
from database import init_db, get_connection

BASE = Path(__file__).parent
MODEL_DIR = BASE / 'model'
app = Flask(__name__)
CORS(app)
init_db()
model_path = MODEL_DIR / 'model.joblib'
preprocessor_path = MODEL_DIR / 'preprocessor.joblib'
model = joblib.load(model_path) if model_path.exists() else None
preprocessor = joblib.load(preprocessor_path) if preprocessor_path.exists() else None

MEDS = ['Crocin','Dolo 650','Calpol','Allegra','Zyrtec','Augmentin','Azithral','Becosules','Shelcal','Pan-D','Omez','Limcee','Neurobion Forte','Cetzine','Combiflam']
SYMPTOMS = ['Fever','Headache','Cough','Sore throat','Runny nose','Nausea','Fatigue','Body pain','Stomach discomfort','Rash','Dizziness','Chest discomfort','Breathing difficulty','Weakness','Vomiting']
SEVERITIES = ['Mild','Medium','Severe']

@app.get('/api/status')
def status():
    return jsonify({'status':'ok','model_ready':model is not None,'message':'Synthetic-score demonstration only; not medical triage.'})

@app.post('/api/predict')
def predict():
    if model is None or preprocessor is None:
        return jsonify({'error':'Model not trained. Run python train.py first.'}), 503
    data = request.get_json(silent=True)
    if not isinstance(data, dict): return jsonify({'errors':{'body':'Expected JSON object'}}), 400
    errors = {}
    try:
        age = int(data.get('age_years'))
        if age < 0 or age > 120: errors['age_years'] = 'Age must be between 0 and 120.'
    except (TypeError, ValueError): errors['age_years'] = 'Age must be a whole number.'
    try:
        days = int(data.get('days_symptoms'))
        if days < 1 or days > 7: errors['days_symptoms'] = 'Days must be between 1 and 7.'
    except (TypeError, ValueError): errors['days_symptoms'] = 'Days must be a whole number from 1 to 7.'
    severity = data.get('reported_severity')
    chronic = data.get('chronic_condition_reported')
    if severity not in SEVERITIES: errors['reported_severity'] = 'Select a severity.'
    if chronic not in ['Yes','No']: errors['chronic_condition_reported'] = 'Select Yes or No.'
    symptoms = [data.get(f'symptom_{i}') or 'None' for i in range(1,4)]
    medicines = [data.get(f'medicine_{i}') or 'None' for i in range(1,4)]
    if symptoms[0] not in SYMPTOMS: errors['symptom_1'] = 'Choose a primary symptom.'
    chosen_symptoms = [s for s in symptoms if s != 'None']
    if len(chosen_symptoms) != len(set(chosen_symptoms)): errors['symptoms'] = 'Symptoms must not be duplicated.'
    if any(s != 'None' and s not in SYMPTOMS for s in symptoms): errors['symptoms'] = 'Invalid symptom selection.'
    chosen_meds = [m for m in medicines if m != 'None']
    if not chosen_meds: errors['medicine_1'] = 'Choose at least one medicine.'
    if len(chosen_meds) != len(set(chosen_meds)): errors['medicines'] = 'Medicines must not be duplicated.'
    if any(m != 'None' and m not in MEDS for m in medicines): errors['medicines'] = 'Invalid medicine selection.'
    if errors: return jsonify({'errors':errors}), 400
    row = {'age_years':age,'days_symptoms':days,'reported_severity':severity,'chronic_condition_reported':chronic,
           'symptom_1':symptoms[0],'symptom_2':symptoms[1],'symptom_3':symptoms[2],
           'medicine_1':medicines[0],'medicine_2':medicines[1],'medicine_3':medicines[2]}
    features = prepare_features(pd.DataFrame([row]))
    raw = float(model.predict(preprocessor.transform(features))[0])
    score = round(min(100.0,max(0.0,(raw/82.0)*100.0)),1)
    # Score bands are purely illustrative UI categories and are not medical advice.
    band = 'Higher demo score' if score >= 65 else 'Mid-range demo score' if score >= 35 else 'Lower demo score'
    with get_connection() as conn:
        conn.execute('INSERT INTO history (score, inputs_json) VALUES (?,?)',(score,json.dumps(row)))
    return jsonify({'score':score,'raw_score':round(raw,2),'label':band,'selected_medicines':chosen_meds,'selected_symptoms':chosen_symptoms,'notice':'This synthetic ML score is not clinically validated and must not be used to assess urgency, treatment or delivery priority.'})

@app.get('/api/medicines')
def medicines():
    df = pd.read_csv(BASE / 'alternative_medicines.csv')
    return jsonify(df.fillna('').to_dict(orient='records'))

@app.get('/api/history')
def history():
    with get_connection() as conn:
        rows = conn.execute('SELECT * FROM history ORDER BY created_at DESC LIMIT 20').fetchall()
    return jsonify([dict(r) for r in rows])

@app.post('/api/savings')
def log_savings():
    data = request.get_json(silent=True) or {}
    try:
        medicine = str(data.get('medicine','')).strip()
        quantity = int(data.get('monthly_quantity'))
        savings = float(data.get('estimated_savings'))
        if not medicine or quantity < 1 or savings < 0: raise ValueError
    except (TypeError,ValueError): return jsonify({'error':'Provide medicine, positive monthly quantity and non-negative savings.'}),400
    with get_connection() as conn: conn.execute('INSERT INTO savings_log (medicine,monthly_quantity,estimated_savings) VALUES (?,?,?)',(medicine,quantity,savings))
    return jsonify({'message':'Savings estimate saved.'}),201

@app.get('/api/savings')
def savings():
    with get_connection() as conn: rows = conn.execute('SELECT * FROM savings_log ORDER BY created_at DESC').fetchall()
    return jsonify([dict(r) for r in rows])

if __name__ == '__main__': app.run(port=5000, debug=True)
