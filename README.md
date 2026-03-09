# med-AI

## How to run (must do this)

Open `http://localhost:8000` in browser.

## Quick verify it is working

1. Confirm the page shows **App status: ready**.
2. Click **Load Example** in any tab.
3. Click **Run Analysis**.
4. You should see generated output in **Clinical Output**.

## If still not working

- If status says `failed to load script`, refresh and ensure `app.js` exists in the same folder.
- Make sure you opened `http://localhost:8000` (not `README.md` file directly).
- If port 8000 is occupied, run:
  - `python3 -m http.server 8080`
  - then open `http://localhost:8080`.

Educational decision-support scaffold only; not an autonomous diagnosis/prescribing tool.

## Starter diagnosis matching

- Community-acquired pneumonia (aliases: `pneumonia`, `cap`)
- Hypertension (aliases: `htn`, `high blood pressure`)
- Type 2 diabetes (aliases: `diabetes`, `t2dm`)

Diagnosis matching now normalizes punctuation/case to improve reliability (for example `CAP`, `cap.`, and `Community Acquired Pneumonia` all match).
