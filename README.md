# med-AI

A lightweight web prototype for doctors and undergraduate medical students with two workflows:

1. **Differential & Exams**
   - Enter complaints, exam findings, and available data.
   - The app now generates an immediate on-page differential + suggested tests using a starter clinical rule set.

2. **Treatment Classes & Safety**
   - Enter confirmed diagnosis + complications.
   - The app generates starter treatment-class guidance with brand/generic examples, active ingredients, frequency/duration ranges, adverse effects, contraindication reminders, and adjunctive options.

> This project is an educational decision-support scaffold. It is **not** a medical device and should never replace licensed clinical judgment, local protocols, or emergency escalation.

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Current starter diagnosis library

- Community-acquired pneumonia
- Hypertension
- Type 2 diabetes

You can extend mappings in `app.js`.
