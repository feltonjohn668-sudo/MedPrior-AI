import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

NUMERIC = ['age_years', 'days_symptoms']
CATEGORICAL = ['reported_severity','chronic_condition_reported','symptom_1','symptom_2','symptom_3','medicine_1','medicine_2','medicine_3']

def make_preprocessor():
    return ColumnTransformer(transformers=[
        ('numeric', StandardScaler(), NUMERIC),
        ('categorical', OneHotEncoder(handle_unknown='ignore'), CATEGORICAL)
    ])

def prepare_features(df):
    df = df.copy()
    for col in CATEGORICAL:
        df[col] = df[col].fillna('None').astype(str)
    df[NUMERIC] = df[NUMERIC].apply(pd.to_numeric, errors='raise')
    return df[NUMERIC + CATEGORICAL]
