import csv, random
from pathlib import Path

ROOT = Path(__file__).parent
random.seed(42)
SYMPTOMS = ['Fever','Headache','Cough','Sore throat','Runny nose','Nausea','Fatigue','Body pain','Stomach discomfort','Rash','Dizziness','Chest discomfort','Breathing difficulty','Weakness','Vomiting']
MEDS = ['Crocin','Dolo 650','Calpol','Allegra','Zyrtec','Augmentin','Azithral','Becosules','Shelcal','Pan-D','Omez','Limcee','Neurobion Forte','Cetzine','Combiflam']
SEVERITIES = ['Mild','Medium','Severe']

# Synthetic demo data only. Target scores are not clinically meaningful.
def score(age, days, severity, chronic, symptoms, meds):
    value = 12 + days * 3 + (10 if severity == 'Medium' else 20 if severity == 'Severe' else 0)
    value += 8 if chronic == 'Yes' else 0
    value += min(age, 90) * 0.12 + len([x for x in symptoms if x != 'None']) * 2 + len([x for x in meds if x != 'None']) * 1.5
    value += random.uniform(-8, 8)
    return round(max(0, min(82, value)), 1)

with (ROOT / 'medprior_dataset.csv').open('w', newline='', encoding='utf-8') as f:
    cols = ['age_years','days_symptoms','reported_severity','chronic_condition_reported','symptom_1','symptom_2','symptom_3','medicine_1','medicine_2','medicine_3','synthetic_priority_score']
    w = csv.DictWriter(f, fieldnames=cols); w.writeheader()
    for _ in range(10000):
        age = random.randint(0, 100); days = random.randint(1, 7); severity = random.choice(SEVERITIES); chronic = random.choice(['Yes','No'])
        n_sym = random.randint(1,3); n_med = random.randint(1,3)
        syms = random.sample(SYMPTOMS, n_sym); meds = random.sample(MEDS, n_med)
        syms += ['None'] * (3-len(syms)); meds += ['None'] * (3-len(meds))
        w.writerow(dict(age_years=age,days_symptoms=days,reported_severity=severity,chronic_condition_reported=chronic,
                        symptom_1=syms[0],symptom_2=syms[1],symptom_3=syms[2],medicine_1=meds[0],medicine_2=meds[1],medicine_3=meds[2],synthetic_priority_score=score(age,days,severity,chronic,syms,meds)))

# Illustrative price/alternative entries, not a verified substitution list. Confirm each item with a pharmacist.
rows = [
('Crocin','Paracetamol','Analgesic/antipyretic','Tablet','15.00','Paracetamol generic','Generic example','10.00','10','33.3','Illustrative'),
('Dolo 650','Paracetamol','Analgesic/antipyretic','Tablet','18.00','Paracetamol generic','Generic example','12.00','10','33.3','Illustrative'),
('Calpol','Paracetamol','Analgesic/antipyretic','Tablet','16.00','Paracetamol generic','Generic example','11.00','10','31.3','Illustrative'),
('Allegra','Fexofenadine','Antihistamine','Tablet','25.00','Fexofenadine generic','Generic example','17.00','10','32.0','Illustrative'),
('Zyrtec','Cetirizine','Antihistamine','Tablet','12.00','Cetirizine generic','Generic example','8.00','10','33.3','Illustrative'),
('Augmentin','Amoxicillin + clavulanate','Antibiotic','Tablet','80.00','Amoxicillin + clavulanate generic','Generic example','55.00','10','31.3','Illustrative; prescription antibiotic'),
('Azithral','Azithromycin','Antibiotic','Tablet','45.00','Azithromycin generic','Generic example','30.00','3','33.3','Illustrative; prescription antibiotic'),
('Becosules','B-complex vitamins','Vitamin supplement','Capsule','8.00','B-complex generic','Generic example','5.00','10','37.5','Illustrative'),
('Shelcal','Calcium + vitamin D3','Supplement','Tablet','20.00','Calcium + vitamin D3 generic','Generic example','14.00','10','30.0','Illustrative'),
('Pan-D','Pantoprazole + domperidone','Acid-related medicine','Capsule','15.00','Pantoprazole + domperidone generic','Generic example','10.00','10','33.3','Illustrative'),
('Omez','Omeprazole','Acid-related medicine','Capsule','10.00','Omeprazole generic','Generic example','7.00','10','30.0','Illustrative'),
('Limcee','Vitamin C','Supplement','Tablet','5.00','Vitamin C generic','Generic example','3.50','10','30.0','Illustrative'),
('Neurobion Forte','B vitamins','Vitamin supplement','Tablet','10.00','B-vitamin generic','Generic example','7.00','10','30.0','Illustrative'),
('Cetzine','Cetirizine','Antihistamine','Tablet','10.00','Cetirizine generic','Generic example','7.00','10','30.0','Illustrative'),
('Combiflam','Ibuprofen + paracetamol','Analgesic','Tablet','12.00','Ibuprofen + paracetamol generic','Generic example','8.00','10','33.3','Illustrative'),
]
with (ROOT / 'alternative_medicines.csv').open('w', newline='', encoding='utf-8') as f:
    cols = ['branded_medicine','salt_composition','therapeutic_category','dosage_form','branded_price_inr','alternative_name','alternative_manufacturer','alternative_price_inr','units_per_pack','savings_percentage','availability']
    w = csv.DictWriter(f, fieldnames=cols); w.writeheader()
    for r in rows: w.writerow(dict(zip(cols,r)))
print('Generated medprior_dataset.csv (10,000 rows) and alternative_medicines.csv (15 entries).')
