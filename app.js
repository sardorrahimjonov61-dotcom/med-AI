const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const output = document.getElementById('output');

const differentialRules = [
  {
    name: 'Community-acquired pneumonia',
    keywords: /(cough|sputum|pleuritic|fever|crackle|infiltrate|consolidation)/i,
    points: 3,
    whyLikely: 'Respiratory symptoms with fever and focal chest findings suggest lower respiratory tract infection.',
    whyLessLikely: 'Lower likelihood when no fever, no cough, and normal chest imaging.',
    tests: ['CBC + CRP', 'Chest X-ray', 'Pulse oximetry/ABG if hypoxic', 'Blood culture if severe'],
  },
  {
    name: 'Acute coronary syndrome',
    keywords: /(chest pain|pressure|radiat|diaphoresis|troponin|ecg changes)/i,
    points: 3,
    whyLikely: 'Classic ischemic chest pain pattern and risk signs increase suspicion.',
    whyLessLikely: 'Less likely with pleuritic pain only and consistently normal serial ECG/troponin.',
    tests: ['12-lead ECG (immediate)', 'Serial high-sensitivity troponin', 'Echocardiography if unstable'],
  },
  {
    name: 'Pulmonary embolism',
    keywords: /(dyspnea|tachycardia|pleuritic|hemoptysis|dvt|immobil|post-op)/i,
    points: 2,
    whyLikely: 'Acute dyspnea/tachycardia with pleuritic symptoms or thrombosis risk factors.',
    whyLessLikely: 'Lower probability when Wells/YEARS is low and D-dimer is negative.',
    tests: ['Wells/YEARS score', 'D-dimer (if low/intermediate risk)', 'CT pulmonary angiography', 'Leg Doppler ultrasound'],
  },
  {
    name: 'Acute pyelonephritis / UTI',
    keywords: /(dysuria|flank|urinary|frequency|cva tenderness|fever|urgency)/i,
    points: 2,
    whyLikely: 'Urinary symptoms with fever/flank pain fit upper urinary tract infection pattern.',
    whyLessLikely: 'Less likely with sterile urinalysis and no urinary complaints.',
    tests: ['Urinalysis + urine culture', 'CBC + renal function', 'Renal ultrasound if obstruction concern'],
  },
  {
    name: 'Acute gastroenteritis / dehydration',
    keywords: /(vomit|diarrhea|dehydrat|abdominal cramp|gastroenteritis)/i,
    points: 2,
    whyLikely: 'GI symptoms with volume depletion features suggest infectious/inflammatory GI cause.',
    whyLessLikely: 'Less likely if persistent localized peritoneal signs or GI bleeding.',
    tests: ['Electrolytes + renal function', 'Stool testing when indicated', 'Point-of-care glucose'],
  },
];

const treatmentGuides = {
  'community-acquired pneumonia': {
    aliases: ['cap', 'pneumonia', 'lung infection'],
    primary: [
      'Beta-lactam + macrolide | Augmentin / Amoxil + Zithromax | amoxicillin-clavulanate + azithromycin | q8-12h + daily | usually 5-7 days',
      'Respiratory fluoroquinolone | Levaquin | levofloxacin | daily | usually 5 days (selected adults)',
    ],
    safety: [
      'Ceftriaxone/beta-lactams | GI upset, rash | anaphylaxis | severe beta-lactam allergy | verify allergy before first dose',
      'Macrolides | nausea, QT prolongation | torsades risk | prolonged QT/drug interactions | ECG if high risk',
      'Fluoroquinolones | tendinopathy, CNS effects | arrhythmia/aortic events | avoid if safer alternatives exist',
    ],
    adjuncts: ['Hydration and oxygen as needed', 'Antipyretics for symptom control', 'VTE prophylaxis if admitted'],
  },
  hypertension: {
    aliases: ['high blood pressure', 'htn'],
    primary: [
      'ACE inhibitor / ARB | Zestril / Cozaar | lisinopril / losartan | daily | chronic therapy',
      'Calcium channel blocker | Norvasc | amlodipine | daily | chronic therapy',
      'Thiazide-type diuretic | Hygroton | chlorthalidone | daily | chronic therapy',
    ],
    safety: [
      'ACE inhibitors | cough | angioedema/hyperkalemia | pregnancy/renal artery stenosis | monitor creatinine & potassium',
      'Thiazides | hyponatremia | severe electrolyte imbalance | gout risk | monitor electrolytes',
    ],
    adjuncts: ['Sodium restriction', 'Weight reduction/exercise', 'Home BP log'],
  },
  'type 2 diabetes': {
    aliases: ['t2dm', 'diabetes', 'dm2'],
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
    .map((rule) => ({ ...rule, score: rule.keywords.test(caseText) ? rule.points : 0 }))
    .filter((rule) => rule.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (ranked.length === 0) {
    return 'I need more details to build a useful differential. Add symptom timeline, vitals, exam findings, and key risk factors.';
  }

  const table = ranked
    .map((r, idx) => `${idx + 1}. ${r.name} | likely: ${r.whyLikely} | less likely: ${r.whyLessLikely} | confidence: ${r.score >= 3 ? 'moderate' : 'low-moderate'}`)
    .join('\n');

  const tests = ranked.map((r) => `- ${r.name}: ${r.tests.join('; ')}`).join('\n');

  return `Differential diagnosis (educational support only):\n${table}\n\nRecommended tests:\n${tests}\n\nEmergency red flags: hemodynamic instability, severe hypoxia, altered mental status, persistent chest pain, or sepsis signs => escalate immediately.`;
}

function findGuide(input) {
  const normalized = input.toLowerCase();
  const entries = Object.entries(treatmentGuides);

  return entries.find(([key, guide]) => {
    if (normalized.includes(key)) {
      return true;
    }

    return guide.aliases.some((alias) => normalized.includes(alias));
  });
}

function genericTreatmentTemplate(diagnosis, complications, safetyData) {
  return `Treatment class guidance for: ${diagnosis || 'Unspecified diagnosis'}\n\nNo exact starter protocol match found, so here is a safe generic structure:\n- First-line class options: follow local guideline for confirmed diagnosis and severity\n- Alternative class options: use if allergy/intolerance/contraindication\n- Dose frequency and duration: adjust by renal/hepatic function, age, pregnancy status\n- Safety checks: allergy history, recent antibiotic exposure, drug interactions, QT/renal/hepatic risk\n- Monitoring: symptom trend, vitals, adverse effects, and key labs based on chosen drug class\n\nContext modifiers provided:\n- Complications/second problem: ${complications || 'N/A'}\n- Safety data: ${safetyData || 'N/A'}\n\nImportant: this output is educational and must be validated against local protocol before prescribing.`;
}

function generateTreatmentText(diagnosis, complications, safetyData) {
  const found = findGuide(diagnosis);
  if (!found) {
    return genericTreatmentTemplate(diagnosis, complications, safetyData);
  }

  const [key, guide] = found;
  return `Treatment class guidance for: ${diagnosis} (matched protocol: ${key})\n\nPrimary therapy (class | brand | active | frequency | typical duration):\n- ${guide.primary.join('\n- ')}\n\nSafety checks (drug/class | common AE | serious AE | contraindications | monitoring):\n- ${guide.safety.join('\n- ')}\n\nAdjunctive options:\n- ${guide.adjuncts.join('\n- ')}\n\nContext modifiers provided:\n- Complications/second problem: ${complications || 'N/A'}\n- Safety data: ${safetyData || 'N/A'}\n\nImportant: verify allergies, recent antibiotic use, organ function, pregnancy status, and local protocol before prescribing.`;
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
    alert('Text copied to clipboard.');
  } catch {
    alert('Copy failed. Please copy manually.');
  }
});
