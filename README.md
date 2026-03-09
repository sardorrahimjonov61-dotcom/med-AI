# med-AI

## Run (reliable)

python3 serve.py --port 8000

Open `http://127.0.0.1:8000`.

This `serve.py` always serves files from the repository folder, so you avoid the common "Not Found" issue caused by starting a server from the wrong directory.
## Quick check

1. Confirm page shows **App status: ready**.
2. Click **Load Example** in either tab.
4. Output appears in **Clinical Output**.

## If still not working

- If status says `failed to load script`, ensure `app.js` exists beside `index.html`.
- If port 8000 is busy: `python3 serve.py --port 8080` then open `http://127.0.0.1:8080`.

Educational decision-support scaffold only; not an autonomous diagnosis/prescribing tool.

## Starter diagnosis matching

- Community-acquired pneumonia (aliases: `pneumonia`, `cap`)
- Hypertension (aliases: `htn`, `high blood pressure`)
- Type 2 diabetes (aliases: `diabetes`, `t2dm`)

Diagnosis matching now normalizes punctuation/case to improve reliability (for example `CAP`, `cap.`, and `Community Acquired Pneumonia` all match).
