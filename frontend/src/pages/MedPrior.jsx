import { useState } from 'react';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { API_BASE } from '../api.js';

// Data Constants
const symptoms = [
  'Fever',
  'Headache',
  'Cough',
  'Sore throat',
  'Runny nose',
  'Nausea',
  'Fatigue',
  'Body pain',
  'Stomach discomfort',
  'Rash',
  'Dizziness',
  'Chest discomfort',
  'Breathing difficulty',
  'Weakness',
  'Vomiting'
];

const medicines = [
  'Crocin',
  'Dolo 650',
  'Calpol',
  'Allegra',
  'Zyrtec',
  'Augmentin',
  'Azithral',
  'Becosules',
  'Shelcal',
  'Pan-D',
  'Omez',
  'Limcee',
  'Neurobion Forte',
  'Cetzine',
  'Combiflam'
];

const empty = {
  age_years: '',
  days_symptoms: '1',
  reported_severity: 'Mild',
  chronic_condition_reported: 'No',
  symptom_1: '',
  symptom_2: 'None',
  symptom_3: 'None',
  medicine_1: '',
  medicine_2: 'None',
  medicine_3: 'None'
};

// Helper Function
function selectOptions(list) {
  return list.map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ));
}

// Main Component
export default function MedPrior({ onResult, onMedicines }) {
  // State Management
  const [form, setForm] = useState(empty);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Form Field Update Handler
  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Form Submission Handler
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setBusy(true);

    try {
      const res = await fetch(`${API_BASE}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          Object.values(data.errors || {}).join(' ') ||
          data.error ||
          'Could not predict.'
        );
        return;
      }

      setResult(data);
      onResult(data);
      onMedicines(data.selected_medicines);
      localStorage.setItem('medprior_latest', JSON.stringify(data));
    } catch {
      setError('Could not reach the backend. Is Flask running?');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page">
      {/* Header Section */}
      <div className="section-heading">
        <div className="eyebrow">MODEL DEMONSTRATION</div>
        <h1>MedPrior AI</h1>
        <p>
          Complete the fields to test the trained regression model. This score
          is synthetic and is not a measure of real medical urgency.
        </p>
      </div>

      {/* Input Form */}
      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
          <label>
            Age (years)
            <input
              type="number"
              min="0"
              max="120"
              value={form.age_years}
              onChange={(e) => update('age_years', e.target.value)}
              required
            />
          </label>

          <label>
            Symptom duration (days)
            <input
              type="number"
              min="1"
              max="7"
              value={form.days_symptoms}
              onChange={(e) => update('days_symptoms', e.target.value)}
              required
            />
          </label>

          <label>
            Reported severity
            <select
              value={form.reported_severity}
              onChange={(e) => update('reported_severity', e.target.value)}
            >
              {selectOptions(['Mild', 'Medium', 'Severe'])}
            </select>
          </label>

          <label>
            Chronic condition reported?
            <select
              value={form.chronic_condition_reported}
              onChange={(e) =>
                update('chronic_condition_reported', e.target.value)
              }
            >
              {selectOptions(['No', 'Yes'])}
            </select>
          </label>

          {/* Symptom Selectors */}
          {['symptom_1', 'symptom_2', 'symptom_3'].map((key, i) => (
            <label key={key}>
              Symptom {i + 1}
              {i > 0 ? ' (optional)' : ''}
              <select
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                required={i === 0}
              >
                <option value="">Choose...</option>
                <option value="None">None</option>
                {selectOptions(symptoms)}
              </select>
            </label>
          ))}

          {/* Medicine Selectors */}
          {['medicine_1', 'medicine_2', 'medicine_3'].map((key, i) => (
            <label key={key}>
              Medicine {i + 1}
              {i > 0 ? ' (optional)' : ''}
              <select
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                required={i === 0}
              >
                <option value="">Choose...</option>
                <option value="None">None</option>
                {selectOptions(medicines)}
              </select>
            </label>
          ))}
        </div>

        {/* Submit Button */}
        <button className="button submit-button" disabled={busy}>
          {busy ? <LoaderCircle className="spin" /> : 'Predict demo score'}{' '}
          <ArrowRight />
        </button>

        {error && <p className="error">{error}</p>}
      </form>

      {/* Result Output Card */}
      {result && (
        <section className="result-card">
          <div className="result-top">
            <div>
              <div className="eyebrow">MODEL OUTPUT</div>
              <h2>Demonstration score</h2>
            </div>
            <div className="score-circle">
              {result.score}
              <small>/100</small>
            </div>
          </div>

          <h3>{result.label}</h3>
          <p>Selected medicines: {result.selected_medicines.join(', ')}</p>
          <p>Selected symptoms: {result.selected_symptoms.join(', ')}</p>

          <div className="warning-box">
            {result.notice} Seek professional care for medical concerns; severe
            or sudden symptoms require immediate local emergency assistance.
          </div>

          <a className="button secondary" href="/saltsaver">
            Compare and order alternatives <ArrowRight />
          </a>
        </section>
      )}
    </main>
  );
}