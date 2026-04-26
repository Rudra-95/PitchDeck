const categorizeFounderType = (text) => {
    const normalized = String(text || '').toLowerCase();
    const visionary = /(vision|future|big idea|moonshot|disrupt|transform)/i;
    const executor = /(build|ship|launch|deliver|execute|product)/i;
    const analyst = /(data|research|numbers|metrics|insight|analysis|model)/i;
    const hustler = /(growth|sales|network|pitch|traction|sales|revenue)/i;

    if (visionary.test(normalized) && !executor.test(normalized)) return 'Visionary';
    if (executor.test(normalized) && !visionary.test(normalized)) return 'Executor';
    if (analyst.test(normalized)) return 'Analyst';
    if (hustler.test(normalized)) return 'Hustler';
    return 'Executor';
};

const scoreFromKeywords = (text, keywords, bias = 5) => {
    let score = bias;
    const lower = String(text || '').toLowerCase();
    for (const keyword of keywords) {
        if (lower.includes(keyword)) score += 2;
    }
    return Math.min(10, Math.max(1, score));
};

const estimateTrendSignal = (category, market) => {
    const text = `${category} ${market}`.toLowerCase();
    if (/fintech|saas|edtech|health|agri|greentech|clean/.test(text)) return 'rising';
    if (/print|paper|traditional|fax|offline/.test(text)) return 'declining';
    return 'stable';
};

const estimateMarketSize = (market, category) => {
    const text = String(market || category || '').toLowerCase();
    if (/\b(enterprise|SME|B2B|wholesale)\b/i.test(text)) return '₹4,000+ crore (large B2B pipeline)';
    if (/\b(farmers|rural|villages|agri)\b/i.test(text)) return '₹1,200+ crore potential in tier-2/3 India';
    if (/\b(young|students|millennials|gen z)\b/i.test(text)) return '₹3,500+ crore fast-growing consumer market';
    return '₹2,000+ crore addressable market estimate';
};

const competitorSnapshot = (category, market) => {
    const base = [];
    const normalized = `${category} ${market}`.toLowerCase();
    if (/fintech/.test(normalized)) {
        base.push('UPI wallets, neobanking apps, managed payments platforms');
    }
    if (/health|wellness/.test(normalized)) {
        base.push('telemedicine players, pharmacy aggregators, wellness apps');
    }
    if (/agri/.test(normalized)) {
        base.push('farm input marketplaces, mandi price alert services, rural fintech');
    }
    if (/edtech/.test(normalized)) {
        base.push('microlearning apps, tuition marketplaces, skill-based cohorts');
    }
    if (base.length === 0) {
        base.push('local incumbents, informal alternatives, and digital-first startups in the same category');
    }
    return base.slice(0, 3);
};

const computeFailureRisk = (scores, category, stage, market) => {
    const average = Object.values(scores).reduce((sum, value) => sum + value, 0) / 5;
    const weakAreas = Object.entries(scores).filter(([, v]) => v <= 4).map(([k]) => k);
    let level = 'Medium';
    let reason = 'The idea shows promise, but keep an eye on execution and market clarity.';

    if (average <= 4) {
        level = 'High';
        reason = 'The concept has several gaps in validation or execution-ready detail that raise failure risk.';
    } else if (average >= 7 && weakAreas.length === 0) {
        level = 'Low';
        reason = 'The idea looks solid across key dimensions, with strong Indian market context and execution realism.';
    }

    if (/declining/.test(estimateTrendSignal(category, market))) {
        level = 'High';
        reason = 'Market sentiment appears soft and adoption may face headwinds in India.';
    }

    return {
        level,
        reason,
        top_risks: weakAreas.length > 0 ? weakAreas.map((area) => `Weak ${area}`) : ['Execution speed', 'Market validation'],
    };
};

const buildPitchDeck = ({ title, problem, solution, market, category, stage }) => {
    return [
        {
            title: 'Problem',
            bullets: [`${problem}`, `Current alternatives are inadequate for ${market}.`],
        },
        {
            title: 'Solution',
            bullets: [`${solution}`, `A better alternative for ${market} with clear customer impact.`],
        },
        {
            title: 'Market',
            bullets: [`Targeting ${market} in India`, estimateMarketSize(market, category), `Category: ${category}`],
        },
        {
            title: 'Why now?',
            bullets: [`Timing is right because of India-specific trends and digital adoption.`, `India is ready for faster, no-friction solutions in this space.`],
        },
        {
            title: 'Business model',
            bullets: [`Primary revenue could come from subscription, transaction fees, or enterprise contracts.`, `Focus on high-margin launch customers first.`],
        },
        {
            title: 'Competition',
            bullets: competitorSnapshot(category, market),
        },
        {
            title: 'Go-to-market',
            bullets: [`Use local distribution, partnerships, and WhatsApp-first growth.`, `Launch with a focused beachhead customer segment.`],
        },
        {
            title: 'Next moves',
            bullets: [`Build a minimum viable version and validate with 10 paying users.`, `Refine pricing and channel before scaling.`],
        },
    ];
};

const allowAi = !!process.env.GROQ_API_KEY;

const runGroqRequest = async (userPrompt) => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: 'You MUST output valid JSON only. No markdown.' },
                { role: 'user', content: userPrompt },
            ],
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`AI request failed: ${text}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return JSON.parse(content);
};

const buildIdeasPayload = (idea) => {
    return {
        title: idea.title || '',
        problem: idea.problem || idea.description || '',
        solution: idea.solution || idea.description || '',
        market: idea.market || idea.target_market || idea.category || 'Indian market',
        category: idea.category || 'Tech',
        stage: idea.stage || 'Just an idea',
    };
};

const fallbackStressTest = ({ title, problem, solution, market, category, stage }) => {
    const promptText = `${title} ${problem} ${solution} ${market}`;
    const scores = {
        'Problem Clarity': scoreFromKeywords(promptText, ['pain', 'problem', 'real problem', 'customer'], 5),
        'Market Potential': scoreFromKeywords(promptText, ['india', 'tier', 'market', 'segment', 'growth', 'large', 'scale'], 5),
        'Uniqueness': scoreFromKeywords(promptText, ['unique', 'first', 'only', 'different', 'proprietary', 'moat'], 4),
        'Execution Feasibility': scoreFromKeywords(promptText, ['build', 'launch', 'MVP', 'team', 'tech', 'product'], 5),
        'Fundability': scoreFromKeywords(promptText, ['revenue', 'traction', 'scale', 'investor', 'growth', 'unit economics'], 4),
    };
    const trend = estimateTrendSignal(category, market);
    return {
        scores,
        verdict: `Strong concept with ${trend === 'rising' ? 'momentum' : trend === 'declining' ? 'caution' : 'interesting potential'} in the Indian market.`,
        vc_questions: [
            `What keeps customers using this instead of the current informal alternative?`,
            `How do you prove adoption in the first 90 days?`,
            `What is the toughest part of your execution plan?`,
        ],
        devil_questions: [
            `Could the same need be solved with a simpler integration into an existing platform?`,
            `Is there a strong enough margin after acquisition and support costs?`,
        ],
        swot: {
            strengths: [`Clearly stated problem`, `Localised for Indian customers`],
            weaknesses: [`Needs sharper go-to-market definition`, `Customer acquisition is only hinted at`],
            opportunities: [`Large addressable market in India`, `Potential B2B partnerships`],
            threats: competitorSnapshot(category, market).map((c) => c),
        },
        india_insight: market ? `This idea should anchor on India-specific behaviour like mobile-first discovery and digital trust to win in ${market}.` : 'Ensure the pitch reflects how Indian users adopt services differently across tiers.',
        next_3_moves: [`Validate with 5 paying users in your local market`, `Map the top 3 competitors and where you outperform them`, `Build a one-page launch plan focused on a clear first customer segment`],
        failure_risk: computeFailureRisk(scores, category, stage, market),
        pivot_advice: [`If consumer adoption is slow, consider a B2B path into service providers.`, `Focus on the highest-paying niche within ${market}.`, `Lock in one strong distribution partner before scaling.`],
        market_reality: {
            estimated_tam: estimateMarketSize(market, category),
            competitor_snapshot: competitorSnapshot(category, market),
            trend_signal: trend,
            signal_explanation: trend === 'declining' ? `Early adoption may face resistance because the category feels traditional and may need a stronger digital hook.` : trend === 'rising' ? `This category is seeing faster adoption and digital spending growth across India.` : `The market is stable, so execution and differentiation will decide success.`,
        },
        pitch_deck: buildPitchDeck({ title, problem, solution, market, category, stage }),
    };
};

const fallbackFounderDNA = ({ submissions, feedbackResponses, writingSample }) => {
    const founderText = `${submissions || ''} ${feedbackResponses || ''} ${writingSample || ''}`;
    const founder_type = categorizeFounderType(founderText);
    const weak_areas = [];
    if (/not sure|unclear|confusing|weak|early/.test(founderText.toLowerCase())) weak_areas.push('Communication clarity');
    if (!/revenue|price|monetization|pricing/.test(founderText.toLowerCase())) weak_areas.push('Monetization path');
    if (!/team|build|tech|product/.test(founderText.toLowerCase())) weak_areas.push('Execution playbook');
    if (weak_areas.length === 0) weak_areas.push('Customer validation');
    const ideal_cofounder = {
        Visionary: 'Executor',
        Executor: 'Analyst',
        Analyst: 'Hustler',
        Hustler: 'Analyst',
    }[founder_type] || 'Executor';
    return {
        founder_type,
        ideal_cofounder_type: ideal_cofounder,
        weak_areas: weak_areas.slice(0, 3),
        strength_summary: founder_type === 'Visionary' ? 'Big-picture thinker with a strong vision and narrative ability.' : founder_type === 'Executor' ? 'Gets things done, launches quickly, and moves fast.' : founder_type === 'Analyst' ? 'Data-driven and methodical, good at research and optimization.' : 'Resourceful and networked, excellent at traction and growth.',
        compatibility_score: Math.floor(70 + Math.random() * 25),
        india_edge: `This founder gains an edge if they keep India-specific distribution, UPI payment flow, and local trust signals at the center of execution.`,
    };
};

const fallbackCompareIdeas = ({ ideaA, ideaB }) => {
    const scoreA = scoreFromKeywords(`${ideaA.title} ${ideaA.description || ''} ${ideaA.category || ''}`, ['scale', 'growth', 'india', 'customer', 'subscription'], 5);
    const scoreB = scoreFromKeywords(`${ideaB.title} ${ideaB.description || ''} ${ideaB.category || ''}`, ['scale', 'growth', 'india', 'customer', 'subscription'], 5);
    const winner = scoreA === scoreB ? 'draw' : scoreA > scoreB ? 'ideaA' : 'ideaB';
    return {
        winner,
        scoreA,
        scoreB,
        analysis: winner === 'draw' ? 'Both ideas are strong, but the final decision should be based on founder fit and channel strength.' : `Idea ${winner === 'ideaA' ? 'A' : 'B'} looks stronger in the current Indian context due to clearer market positioning and execution readiness.`,
        market_edge: `Both ideas should check competitor intensity carefully; ${winner === 'ideaA' ? 'Idea B' : 'Idea A'} may be easier to position if its founders can quickly prove product-market fit.`,
        recommendation: winner === 'draw' ? 'Test both with an MVP, then scale the one that gets faster user traction.' : `Fund the idea with the stronger narrative and easier customer acquisition path.`,
    };
};

const fallbackPitchDeck = ({ title, problem, solution, market, category, stage }) => ({
    slides: buildPitchDeck({ title, problem, solution, market, category, stage }),
});

const runAiOrFallback = async (handler, fallbackFn, prompt) => {
    if (allowAi) {
        try {
            return await runGroqRequest(prompt);
        } catch (err) {
            console.error('AI request failed; using fallback:', err.message);
        }
    }
    return fallbackFn();
};

const stressTestIdea = async (req, res, next) => {
    try {
        const { title, problem, solution, market, category = 'Tech', stage = 'Just an idea' } = req.body;

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
  "vc_questions": ["<brutal VC question 1 specific to this idea>", "<brutal VC question 2>", "<brutal VC question 3>"],
  "devil_questions": ["<devil's advocate challenge 1 — e.g. competitor or free alternative exists>", "<devil's advocate challenge 2>"],
  "swot": {
    "strengths": ["<strength 1>", "<strength 2>"],
    "weaknesses": ["<weakness 1>", "<weakness 2>"],
    "opportunities": ["<opportunity 1 specific to India>", "<opportunity 2>"],
    "threats": ["<threat 1>", "<threat 2>"]
  },
  "india_insight": "<1-2 sentences about a specific India-context nuance — regulatory, infrastructure, behaviour, or cultural — that this founder must think about>",
  "next_3_moves": ["<concrete action 1 founder should take this week>", "<action 2>", "<action 3>"],
  "failure_risk": {
    "level": "<High|Medium|Low>",
    "reason": "<brief reason why this idea is at this risk level>",
    "top_risks": ["<risk 1>", "<risk 2>"]
  },
  "pivot_advice": ["<pivot idea 1>", "<pivot idea 2>", "<pivot idea 3>"],
  "market_reality": {
    "estimated_tam": "<approximate market size in Rupees or dollars>",
    "competitor_snapshot": ["<competitor 1>", "<competitor 2>", "<competitor 3>"],
    "trend_signal": "<rising|declining|stable>",
    "signal_explanation": "<short explanation of the market trend in India>"
  },
  "pitch_deck": [
    { "title": "Problem", "bullets": ["<bullet 1>", "<bullet 2>"] },
    { "title": "Solution", "bullets": ["<bullet 1>", "<bullet 2>"] },
    { "title": "Market", "bullets": ["<bullet 1>", "<bullet 2>"] },
    { "title": "Why now?", "bullets": ["<bullet 1>", "<bullet 2>"] },
    { "title": "Business model", "bullets": ["<bullet 1>", "<bullet 2>"] },
    { "title": "Competition", "bullets": ["<bullet 1>", "<bullet 2>"] },
    { "title": "Go-to-market", "bullets": ["<bullet 1>", "<bullet 2>"] },
    { "title": "Next moves", "bullets": ["<bullet 1>", "<bullet 2>"] }
  ]
}`;

        const result = await runAiOrFallback(
            () => runGroqRequest(prompt),
            () => fallbackStressTest({ title, problem, solution, market, category, stage }),
            prompt
        );

        return res.json(result);
    } catch (err) {
        console.error('Stress Test Error:', err);
        return res.status(500).json({ error: 'Failed to complete stress test structure.' });
    }
};

const analyzeFounder = async (req, res, next) => {
    try {
        const { submissions, feedbackResponses, writingSample } = req.body;
        if (!submissions && !writingSample) {
            return res.status(400).json({ error: 'Please provide founder writing or submission details.' });
        }

        const prompt = `You are a startup talent scout for India. Analyze the founder based on their submissions, feedback and writing style. Respond ONLY with a valid JSON object. No markdown.

Founder data:
Submissions: ${submissions || ''}
Feedback responses: ${feedbackResponses || ''}
Writing sample: ${writingSample || ''}

Return exactly this JSON structure:
{
  "founder_type": "<Visionary|Executor|Analyst|Hustler>",
  "ideal_cofounder_type": "<recommended co-founder type>",
  "weak_areas": ["<weak area 1>", "<weak area 2>", "<weak area 3>"],
  "strength_summary": "<short founder strengths summary>",
  "compatibility_score": <integer 1-100>,
  "india_edge": "<India-specific advantage or caution for this founder>"
}`;

        const result = await runAiOrFallback(
            () => runGroqRequest(prompt),
            () => fallbackFounderDNA({ submissions, feedbackResponses, writingSample }),
            prompt
        );

        return res.json(result);
    } catch (err) {
        console.error('Founder DNA Error:', err);
        return res.status(500).json({ error: 'Failed to analyze founder DNA.' });
    }
};

const compareIdeas = async (req, res, next) => {
    try {
        const { ideaA, ideaB } = req.body;
        if (!ideaA || !ideaB) {
            return res.status(400).json({ error: 'Two ideas are required for comparison.' });
        }

        const prompt = `You are a fierce Indian investor comparing two startup ideas. Evaluate both and return only JSON. No markdown.

Idea A:
Title: ${ideaA.title}
Description: ${ideaA.description || ideaA.problem || ''}
Category: ${ideaA.category || ''}
Stage: ${ideaA.stage || ''}

Idea B:
Title: ${ideaB.title}
Description: ${ideaB.description || ideaB.problem || ''}
Category: ${ideaB.category || ''}
Stage: ${ideaB.stage || ''}

Return exactly this JSON structure:
{
  "winner": "<ideaA|ideaB|draw>",
  "scoreA": <integer 1-10>,
  "scoreB": <integer 1-10>,
  "analysis": "<short comparison analysis>",
  "market_edge": "<which idea has stronger market edge and why>",
  "recommendation": "<clear guide for which idea to fund and why>"
}`;

        const result = await runAiOrFallback(
            () => runGroqRequest(prompt),
            () => fallbackCompareIdeas({ ideaA, ideaB }),
            prompt
        );

        return res.json(result);
    } catch (err) {
        console.error('Compare Ideas Error:', err);
        return res.status(500).json({ error: 'Failed to compare ideas.' });
    }
};

const generatePitchDeck = async (req, res, next) => {
    try {
        const { title, problem, solution, market, category = 'Tech', stage = 'Just an idea' } = req.body;
        if (!title || !problem || !solution) {
            return res.status(400).json({ error: 'Title, problem and solution are required.' });
        }

        const prompt = `You are a pitch deck coach for Indian startups. Generate 8 concise slides for this idea and return only valid JSON. No markdown.

Idea:
Title: ${title}
Problem: ${problem}
Solution: ${solution}
Target market: ${market}
Category: ${category}
Stage: ${stage}

Return exactly this JSON structure:
{
  "slides": [
    { "title": "<slide title>", "bullets": ["<bullet 1>", "<bullet 2>"] },
    ...
  ]
}`;

        const result = await runAiOrFallback(
            () => runGroqRequest(prompt),
            () => fallbackPitchDeck({ title, problem, solution, market, category, stage }),
            prompt
        );

        return res.json(result);
    } catch (err) {
        console.error('Pitch Deck Error:', err);
        return res.status(500).json({ error: 'Failed to generate the pitch deck.' });
    }
};

module.exports = { stressTestIdea, analyzeFounder, compareIdeas, generatePitchDeck };
