# med-AI

A lightweight web prototype for doctors and undergraduate medical students with two workflows:

1. **Differential & Exams**
   - Enter complaints, exam findings, and available data.
   - Click **Run Analysis** to get immediate on-page differential suggestions, tests, and red-flag reminders.

2. **Treatment Classes & Safety**
   - Enter confirmed diagnosis + complications.
   - Click **Run Analysis** to get starter treatment-class guidance (brand/generic examples, active ingredients, frequency/duration ranges, adverse effects, contraindications, and adjunctive options).
   - If diagnosis text does not match a starter protocol, the app returns a safe generic planning template instead of failing.

> This project is an educational decision-support scaffold. It is **not** a medical device and should never replace licensed clinical judgment, local protocols, or emergency escalation.

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Starter diagnosis matching

- Community-acquired pneumonia (aliases: `pneumonia`, `cap`)
- Hypertension (aliases: `htn`, `high blood pressure`)
- Type 2 diabetes (aliases: `diabetes`, `t2dm`)

Diagnosis matching now normalizes punctuation/case to improve reliability (for example `CAP`, `cap.`, and `Community Acquired Pneumonia` all match).
