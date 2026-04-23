const stressTestIdea = async (req, res, next) => {
    try {
        const { title, problem, solution, market, category, stage } = req.body;
        
        if (!title || !problem || !solution || !market) {
            return res.status(400).json({ error: 'Missing required fields for stress test.' });
        }

        const prompt = `You are a brutally honest startup mentor for the Indian market — part skeptical VC, part devil's advocate, part market researcher. Analyse this startup idea and respond ONLY with a valid JSON object matching the requested schema. No markdown wrapping or explanations.

Startup idea:
Title: ${title}
Problem: ${problem}
Solution: ${solution}
Target market: ${market}
Category: ${category}
Stage: ${stage}

Return exactly this JSON structure:
{
  "scores": {
    "Problem Clarity": <integer 1-10>,
    "Market Potential": <integer 1-10>,
    "Uniqueness": <integer 1-10>,
    "Execution Feasibility": <integer 1-10>,
    "Fundability": <integer 1-10>
  },
  "verdict": "<one punchy sentence verdict — like a VC would say in a pitch meeting>",
  "vc_questions": [
    "<brutal VC question 1 specific to this idea>",
    "<brutal VC question 2>",
    "<brutal VC question 3>"
  ],
  "devil_questions": [
    "<devil's advocate challenge 1 — e.g. competitor or free alternative exists>",
    "<devil's advocate challenge 2>"
  ],
  "swot": {
    "strengths": ["<strength 1>", "<strength 2>"],
    "weaknesses": ["<weakness 1>", "<weakness 2>"],
    "opportunities": ["<opportunity 1 specific to India>", "<opportunity 2>"],
    "threats": ["<threat 1>", "<threat 2>"]
  },
  "india_insight": "<1-2 sentences about a specific India-context nuance — regulatory, infrastructure, behaviour, or cultural — that this founder must think about>",
  "next_3_moves": ["<concrete action 1 founder should take this week>", "<action 2>", "<action 3>"]
}`;

        // Uses Groq for ultra-fast LPU inference (Crucial for live interview demo)
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Or mixtral-8x7b-32768
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: "You MUST output valid JSON only. You play the role of an aggressive Indian VC interrogating a pitch." },
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Groq API Error:", errText);
            return res.status(500).json({ error: 'AI engine failed to analyze the idea.' });
        }

        const data = await response.json();
        const jsonContent = JSON.parse(data.choices[0].message.content);
        
        return res.json(jsonContent);

    } catch (err) {
        console.error("Stress Test Error:", err);
        return res.status(500).json({ error: 'Failed to complete stress test structure.' });
    }
};

module.exports = { stressTestIdea };
