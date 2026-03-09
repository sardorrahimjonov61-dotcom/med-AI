# med-AI

A lightweight web prototype for doctors and undergraduate medical students with two workflows:

1. **Differential & Exams**
   - Enter complaints, exam findings, and available data.
   - The app generates immediate on-page differential suggestions with recommended tests and red-flag escalation reminders.

2. **Treatment Classes & Safety**
   - Enter confirmed diagnosis + complications.
   - The app returns starter treatment-class guidance including brand/generic examples, active ingredients, frequency/duration ranges, adverse effects, contraindication reminders, and adjunctive options.
   - If the diagnosis is not found in the starter map, it now returns a generic safe treatment-planning template instead of failing.

> This project is an educational decision-support scaffold. It is **not** a medical device and should never replace licensed clinical judgment, local protocols, or emergency escalation.

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Current starter diagnosis library

- Community-acquired pneumonia (aliases include `pneumonia`, `cap`)
- Hypertension (aliases include `htn`, `high blood pressure`)
- Type 2 diabetes (aliases include `diabetes`, `t2dm`)

You can extend mappings in `app.js`.
