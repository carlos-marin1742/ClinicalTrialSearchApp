//isolated unit test for groq query

// run with    node --env-file=.env server/test-groq.js
import { getGroqSummary } from './groq.js';

const testEligibilityText = `
Inclusion Criteria:
- Adults aged 18-65
- Diagnosed with Type 2 Diabetes
- HbA1c levels between 7% and 10%

Exclusion Criteria:
- Pregnant or breastfeeding women
- History of severe hypoglycemia
- Use of insulin therapy in the past 3 months
`;
const summary = await getGroqSummary(testEligibilityText);
console.log('Groq Summary:\n', summary);