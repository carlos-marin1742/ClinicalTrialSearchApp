import Groq from 'groq-sdk';

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

export async function getGroqSummary(eligibilityText) {
    const chat = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages:[
            {role: 'system',
content: `You are a clinical trial assistant helping patients understand if they qualify for a trial.
Summarize the eligibility criteria below in plain English.
Use simple language a non-medical person can understand.
Structure your response as two short sections:
- Who may qualify (2-3 bullet points)
- Who is excluded (2-3 bullet points)
Keep the entire response under 120 words.`
            },{
role: 'user',
content: eligibilityText
            }
        ]

        
    });
    return chat.choices[0].message.content;
}
