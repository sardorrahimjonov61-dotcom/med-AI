const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const output = document.getElementById('output');

const differentialRules = [
  {
    name: 'Community-acquired pneumonia',
    score: (text) => (/(cough|sputum|pleuritic|fever|crackle|infiltrate)/i.test(text) ? 3 : 0),
    whyLikely: 'Respiratory symptoms with fever and focal chest findings suggest lower respiratory tract infection.',
    whyLessLikely: 'Lower likelihood when no fever, no cough, and normal chest imaging.',
    tests: ['CBC + CRP', 'Chest X-ray', 'Pulse oximetry/ABG if hypoxic', 'Blood culture if severe'],
  },
  {
    name: 'Acute coronary syndrome',
    score: (text) => (/(chest pain|pressure|radiat|diaphoresis|troponin)/i.test(text) ? 3 : 0),
    whyLikely: 'Classic ischemic chest pain pattern and risk signs increase suspicion.',
    whyLessLikely: 'Less likely with pleuritic pain only and consistently normal serial ECG/troponin.',
    tests: ['12-lead ECG (immediate)', 'Serial high-sensitivity troponin', 'Echocardiography if unstable'],
  },
  {
    name: 'Pulmonary embolism',
    score: (text) => (/(dyspnea|tachycardia|pleuritic|hemoptysis|dvt|immobil)/i.test(text) ? 2 : 0),
    whyLikely: 'Acute dyspnea/tachycardia with pleuritic symptoms or thrombosis risk factors.',
    whyLessLikely: 'Lower probability when Wells/YEARS is low and D-dimer is negative.',
    tests: ['Wells/YEARS score', 'D-dimer (if low/intermediate risk)', 'CT pulmonary angiography', 'Leg Doppler ultrasound'],
  },
  {
    name: 'Acute pyelonephritis / UTI',
    score: (text) => (/(dysuria|flank|urinary|frequency|cva tenderness|fever)/i.test(text) ? 2 : 0),
    whyLikely: 'Urinary symptoms with fever/flank pain fit upper urinary tract infection pattern.',
    whyLessLikely: 'Less likely with sterile urinalysis and no urinary complaints.',
    tests: ['Urinalysis + urine culture', 'CBC + renal function', 'Renal ultrasound if obstruction concern'],
  },
];

const treatmentGuides = {
  'community-acquired pneumonia': {
    primary: [
      'Beta-lactam + macrolide | Augmentin / Amoxil + Zithromax | amoxicillin-clavulanate + azithromycin | q8-12h + daily | 5-7 days',
      'Respiratory fluoroquinolone | Levaquin | levofloxacin | daily | 5 days (selected adults)',
    ],
    safety: [
      'Ceftriaxone/beta-lactams | GI upset, rash | anaphylaxis | severe beta-lactam allergy | allergy history before first dose',
      'Macrolides | nausea, QT prolongation | torsades risk | prolonged QT/drug interactions | baseline ECG when high risk',
      'Fluoroquinolones | tendinopathy, CNS effects | arrhythmia/aortic events | avoid if safer alternatives exist',
    ],
    adjuncts: ['Hydration and oxygen as needed', 'Antipyretics for symptom control', 'VTE prophylaxis if admitted'],
  },
  'hypertension': {
    primary: [
      'ACE inhibitor / ARB | Zestril / Cozaar | lisinopril / losartan | daily | chronic therapy',
      'Calcium channel blocker | Norvasc | amlodipine | daily | chronic therapy',
      'Thiazide-type diuretic | Hygroton | chlorthalidone | daily | chronic therapy',
    ],
    safety: [
      'ACE inhibitors | cough | angioedema/hyperkalemia | pregnancy/renal artery stenosis | monitor creatinine & K+',
      'Thiazides | hyponatremia | severe electrolyte imbalance | gout risk | monitor electrolytes',
    ],
    adjuncts: ['Sodium restriction', 'Weight reduction/exercise', 'Home BP log'],
  },
  'type 2 diabetes': {
    primary: [
      'Biguanide | Glucophage | metformin | 1-2 times/day | chronic therapy',
      'SGLT2 inhibitor | Jardiance | empagliflozin | daily | chronic therapy',
      'GLP-1 receptor agonist | Ozempic | semaglutide | weekly | chronic therapy',
    ],
    safety: [
      'Metformin | GI upset | lactic acidosis (rare) | severe renal failure | monitor eGFR',
      'SGLT2 inhibitors | genital infections | euglycemic DKA (rare) | dehydration/ketosis risk',
      'GLP-1 agonists | nausea/vomiting | pancreatitis risk | caution in severe GI disease',
    ],
    adjuncts: ['Nutrition counseling', 'Foot/eye/kidney screening', 'Cardiovascular risk optimization'],
  },
};

for (const tab of tabs) {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    panels.forEach((p) => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
}

function generateDifferentialText(caseText) {
  const ranked = differentialRules
    .map((rule) => ({ ...rule, points: rule.score(caseText) }))
    .filter((rule) => rule.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  if (ranked.length === 0) {
    return 'No strong keyword match found. Please add more clinical details (symptoms, exam findings, timeline, risk factors).';
  }

  const table = ranked
    .map((r, idx) => `${idx + 1}. ${r.name} | likely: ${r.whyLikely} | less likely: ${r.whyLessLikely} | confidence: ${r.points >= 3 ? 'moderate' : 'low-moderate'}`)
    .join('\n');

  const tests = ranked
    .map((r) => `- ${r.name}: ${r.tests.join('; ')}`)
    .join('\n');

  return `Differential diagnosis (educational support only):\n${table}\n\nRecommended tests:\n${tests}\n\nEmergency red flags: hemodynamic instability, severe hypoxia, altered mental status, persistent chest pain, or sepsis signs => escalate immediately.`;
}

function findGuideKey(input) {
  const normalized = input.toLowerCase();
  return Object.keys(treatmentGuides).find((key) => normalized.includes(key));
}

function generateTreatmentText(diagnosis, complications, safetyData) {
  const key = findGuideKey(diagnosis);
  if (!key) {
    return 'Diagnosis not in starter library yet. Try: Community-acquired pneumonia, Hypertension, or Type 2 diabetes. (You can extend treatmentGuides in app.js).';
  }

  const guide = treatmentGuides[key];
  return `Treatment class guidance for: ${diagnosis}\n\nPrimary therapy (class | brand | active | frequency | typical duration):\n- ${guide.primary.join('\n- ')}\n\nSafety checks (drug/class | common AE | serious AE | contraindications | monitoring):\n- ${guide.safety.join('\n- ')}\n\nAdjunctive options:\n- ${guide.adjuncts.join('\n- ')}\n\nContext modifiers provided:\n- Complications/second problem: ${complications || 'N/A'}\n- Safety data: ${safetyData || 'N/A'}\n\nImportant: verify allergies, recent antibiotic use, organ function, pregnancy status, and local protocol before prescribing.`;
}

document.getElementById('diagnosisForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const complaints = document.getElementById('complaints').value.trim();
  const vitals = document.getElementById('vitals').value.trim();
  const currentWorkup = document.getElementById('currentWorkup').value.trim();
  const caseText = `${complaints} ${vitals} ${currentWorkup}`;

  output.textContent = generateDifferentialText(caseText);
});

document.getElementById('treatmentForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const confirmedDiagnosis = document.getElementById('confirmedDiagnosis').value.trim();
  const complications = document.getElementById('complications').value.trim();
  const safetyData = document.getElementById('safetyData').value.trim();

  output.textContent = generateTreatmentText(confirmedDiagnosis, complications, safetyData);
});

document.getElementById('copyOutput').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(output.textContent);
    alert('Prompt copied to clipboard.');
  } catch {
    alert('Copy failed. Please copy manually.');
  }
});
