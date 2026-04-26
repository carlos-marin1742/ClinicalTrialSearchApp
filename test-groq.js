import { getGroqSummary } from './services/groq.js';

const sampleEligibility = `
  Inclusion Criteria:
  - Adults 18 years or older
  - Diagnosed with Type 2 Diabetes for at least 6 months
  - HbA1c between 7.5% and 11%

  Exclusion Criteria:
  - Pregnant or breastfeeding
  - Currently on insulin therapy
  - Severe kidney disease (eGFR < 30)
`;

const summary = await getGroqSummary(sampleEligibility);
console.log(summary);
