from pathlib import Path
import json
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor
from preprocessing import make_preprocessor, prepare_features

BASE = Path(__file__).parent
MODEL_DIR = BASE / 'model'
MODEL_DIR.mkdir(exist_ok=True)

def main():
    data = pd.read_csv(BASE / 'medprior_dataset.csv')
    X = prepare_features(data.drop(columns=['synthetic_priority_score']))
    y = data['synthetic_priority_score']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    preprocessor = make_preprocessor()
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    model = XGBRegressor(n_estimators=120, max_depth=4, learning_rate=0.08, objective='reg:squarederror', random_state=42)
    model.fit(X_train_processed, y_train)
    predictions = model.predict(X_test_processed)
    metrics = {'MAE': float(mean_absolute_error(y_test, predictions)), 'RMSE': float(np.sqrt(mean_squared_error(y_test, predictions))), 'R2': float(r2_score(y_test, predictions)), 'note': 'Metrics are for synthetic demonstration data; not clinically validated.'}
    joblib.dump(model, MODEL_DIR / 'model.joblib')
    joblib.dump(preprocessor, MODEL_DIR / 'preprocessor.joblib')
    (MODEL_DIR / 'model_metrics.json').write_text(json.dumps(metrics, indent=2), encoding='utf-8')
    print('Model trained and saved. Metrics:', metrics)

if __name__ == '__main__': main()
