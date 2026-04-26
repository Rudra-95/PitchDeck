import { useEffect, useRef, useState } from "react";
import api from '../api';

const SAFFRON = "#f97316";
const SAFFRON2 = "#ea580c";

const CATEGORIES = ["Fintech", "EdTech", "HealthTech", "AgriTech", "SaaS", "E-commerce", "CleanTech", "Other"];
const STAGES = ["Just an idea", "Problem validated", "MVP built", "Beta / launched"];

const SCORE_LABELS = {
  "Problem Clarity": "How sharp and real the problem statement is",
  "Market Potential": "Size and accessibility of the Indian target market",
  "Uniqueness": "Differentiation from existing solutions",
  "Execution Feasibility": "How realistic it is to build with limited resources",
  "Fundability": "Likelihood an Indian angel / VC would consider this"
};

const METER_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];

function getMeterColor(score) {
  if (score <= 2) return METER_COLORS[0];
  if (score <= 3) return METER_COLORS[1];
  if (score <= 5) return METER_COLORS[2];
  if (score <= 7) return METER_COLORS[3];
  return METER_COLORS[4];
}

function ScoreBar({ label, score, description, delay }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score * 10), delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#1a1814" }}>{label}</span>
        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, color: getMeterColor(score) }}>{score}<span style={{ fontSize: 12, fontWeight: 400, color: "#9a9690" }}>/10</span></span>
      </div>
      <div style={{ height: 7, background: "#f0ede6", borderRadius: 999, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: width + "%",
          background: getMeterColor(score),
          borderRadius: 999,
          transition: "width 1s cubic-bezier(.4,0,.2,1)"
        }} />
      </div>
      <div style={{ fontSize: 11, color: "#9a9690", marginTop: 4 }}>{description}</div>
    </div>
  );
}

function TypewriterText({ text, speed = 18 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    setDone(false);
    if (!text) return;
    const iv = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);

  return <span>{displayed}{!done && <span style={{ opacity: 0.4, animation: "blink 1s step-end infinite" }}>|</span>}</span>;
}

function QuestionCard({ question, index, isVC }) {
  return (
    <div style={{
      background: isVC ? "#fff8f5" : "#f8f9ff",
      border: `1px solid ${isVC ? "#fddccc" : "#dde3ff"}`,
      borderRadius: 12,
      padding: "16px 18px",
      marginBottom: 12,
      position: "relative"
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: isVC ? SAFFRON : "#4f46e5",
          color: "#fff", fontSize: 12, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, marginTop: 1
        }}>
          {isVC ? "VC" : "DA"}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: isVC ? "#9a3412" : "#3730a3", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {isVC ? "Skeptical Investor" : "Devil's Advocate"}
          </div>
          <div style={{ fontSize: 14, color: "#2a2820", lineHeight: 1.6 }}>{question}</div>
        </div>
      </div>
    </div>
  );
}

function SWOTBox({ title, items, color, bg, border }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px", flex: 1 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{title}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ fontSize: 13, color: "#2a2820", lineHeight: 1.55, marginBottom: 6, paddingLeft: 14, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, color }}>→</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShareCard({ idea, scores, verdict }) {
  const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length * 10) / 10;
  return (
    <div style={{
      background: "linear-gradient(135deg, #0f0e0c 0%, #1e1c18 100%)",
      borderRadius: 16, padding: "28px 32px", marginTop: 24,
      border: "1px solid #2a2820"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: "#f97316", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>PitchDeck India</div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{idea.title}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 44, fontWeight: 800, color: getMeterColor(overall), lineHeight: 1 }}>{overall}</div>
          <div style={{ fontSize: 11, color: "#6b6860" }}>/ 10</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {Object.entries(scores).map(([k, v]) => (
          <div key={k} style={{ background: "#2a2820", borderRadius: 8, padding: "6px 10px", fontSize: 12 }}>
            <span style={{ color: "#6b6860" }}>{k.split(" ")[0]}: </span>
            <span style={{ color: getMeterColor(v), fontWeight: 700 }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ fontStyle: "italic", fontSize: 13, color: "#9a9690", borderTop: "1px solid #2a2820", paddingTop: 12 }}>
        "{verdict}"
      </div>
      <div style={{ marginTop: 12, fontSize: 11, color: "#4a4840" }}>pitchdeck.vercel.app · India's Startup Validation Community</div>
    </div>
  );
}

export default function StressTester() {
  const [step, setStep] = useState("form"); // form | loading | result
  const [form, setForm] = useState({ title: "", problem: "", solution: "", market: "", category: "Fintech", stage: "Just an idea" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  function updateForm(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function runAnalysis() {
    if (!form.title || !form.problem || !form.solution || !form.market) {
      setError("Please fill all fields before stress-testing your idea.");
      return;
    }
    setError("");
    setStep("loading");
    setProgress(0);

    const progInterval = setInterval(() => {
      setProgress(p => p < 88 ? p + Math.random() * 12 : p);
    }, 400);

    try {
      // Connects to our backend which securely hides the Groq API key
      const { data } = await api.post('/ai/stress-test', form);
      
      clearInterval(progInterval);
      setProgress(100);

      // Bind the input form data with the results to pass deeply into children
      setResult({ ...data, idea: form });
      setTimeout(() => setStep("result"), 400);
    } catch (e) {
      clearInterval(progInterval);
      setError("AI Engine Analysis failed. Ensure Backend Server is running and Groq API Key is valid.");
      setStep("form");
    }
  }

  const inputStyle = {
    width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 13,
    padding: "10px 14px", border: "1.5px solid #e8e4da", borderRadius: 9,
    background: "#fff", color: "#1a1814", outline: "none",
    transition: "border-color .15s", boxSizing: "border-box"
  };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#6b6860", marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" };

  if (step === "loading") return (
    <div style={{ minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", border: `4px solid #f0ede6`, borderTop: `4px solid ${SAFFRON}`, animation: "spin 1s linear infinite", marginBottom: 28 }} />
      <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, color: "#1a1814", marginBottom: 8 }}>Stress-testing your idea…</div>
      <div style={{ fontSize: 13, color: "#9a9690", marginBottom: 28 }}>Playing VC, devil's advocate, and market researcher</div>
      <div style={{ width: 260, height: 6, background: "#f0ede6", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: progress + "%", background: SAFFRON, borderRadius: 999, transition: "width 0.4s ease" }} />
      </div>
      <div style={{ fontSize: 12, color: "#c0bdb5", marginTop: 8 }}>{Math.round(progress)}%</div>
    </div>
  );

  if (step === "result" && result) {
    const overall = Math.round(Object.values(result.scores).reduce((a, b) => a + b, 0) / Object.keys(result.scores).length * 10) / 10;
    const overallColor = getMeterColor(overall);

    return (
      <div style={{ fontFamily: "'Inter', sans-serif", background: "#faf8f3", minHeight: "100vh" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #e8e4da", padding: "14px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setStep("form")} style={{ background: "none", border: "1px solid #e8e4da", borderRadius: 7, padding: "6px 12px", fontSize: 12, cursor: "pointer", color: "#6b6860" }}>← New idea</button>
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 15, color: "#1a1814" }}>PitchDeck India · AI Stress-Test Report</span>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px 60px" }}>

          {/* Header score */}
          <div style={{ background: "#fff", border: "1px solid #e8e4da", borderRadius: 16, padding: "28px 28px 24px", marginBottom: 20, animation: "fadeUp .5s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: SAFFRON, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{result.idea.category} · {result.idea.stage}</div>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, color: "#1a1814", lineHeight: 1.2, marginBottom: 10 }}>{result.idea.title}</div>
                <div style={{ fontSize: 14, color: "#6b6860", lineHeight: 1.6, fontStyle: "italic" }}>"{result.verdict}"</div>
              </div>
              <div style={{ textAlign: "center", padding: "8px 16px", background: "#faf8f3", borderRadius: 12 }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 52, fontWeight: 800, color: overallColor, lineHeight: 1 }}>{overall}</div>
                <div style={{ fontSize: 11, color: "#9a9690", marginTop: "2px" }}>Overall / 10</div>
              </div>
            </div>
          </div>

          {/* Scores */}
          <div style={{ background: "#fff", border: "1px solid #e8e4da", borderRadius: 16, padding: "24px 28px", marginBottom: 20, animation: "fadeUp .5s ease .1s both" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>Validation Scores</div>
            {Object.entries(result.scores).map(([k, v], i) => (
              <ScoreBar key={k} label={k} score={v} description={SCORE_LABELS[k]} delay={i * 150} />
            ))}
          </div>

          {/* Questions */}
          <div style={{ background: "#fff", border: "1px solid #e8e4da", borderRadius: 16, padding: "24px 28px", marginBottom: 20, animation: "fadeUp .5s ease .2s both" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Hard Questions You Must Answer</div>
            {result.vc_questions.map((q, i) => <QuestionCard key={`vc-${i}`} question={q} index={i} isVC={true} />)}
            {result.devil_questions.map((q, i) => <QuestionCard key={`da-${i}`} question={q} index={i} isVC={false} />)}
          </div>

          {/* SWOT */}
          <div style={{ background: "#fff", border: "1px solid #e8e4da", borderRadius: 16, padding: "24px 28px", marginBottom: 20, animation: "fadeUp .5s ease .3s both" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>SWOT Analysis</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <SWOTBox title="Strengths" items={result.swot.strengths} color="#15803d" bg="#f0fdf4" border="#bbf7d0" />
              <SWOTBox title="Weaknesses" items={result.swot.weaknesses} color="#b91c1c" bg="#fef2f2" border="#fecaca" />
              <SWOTBox title="Opportunities" items={result.swot.opportunities} color="#1d4ed8" bg="#eff6ff" border="#bfdbfe" />
              <SWOTBox title="Threats" items={result.swot.threats} color="#b45309" bg="#fffbeb" border="#fde68a" />
            </div>
          </div>

          {/* Market reality & pivot */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20, animation: "fadeUp .5s ease .4s both" }}>
            <div style={{ background: "#fff", border: "1px solid #e8e4da", borderRadius: 16, padding: "24px 28px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Market reality check</div>
              <div style={{ fontSize: 14, color: "#1a1814", marginBottom: 12 }}><strong>Trend:</strong> {result.market_reality?.trend_signal || 'stable'}</div>
              <div style={{ fontSize: 14, color: "#1a1814", marginBottom: 12 }}><strong>Estimated TAM:</strong> {result.market_reality?.estimated_tam || 'N/A'}</div>
              <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.8 }}>{result.market_reality?.signal_explanation || 'No trend signal available yet.'}</div>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#9a9690", textTransform: "uppercase", marginBottom: 10 }}>Competitor snapshot</div>
                <ul style={{ margin: 0, paddingLeft: 18, color: "#334155" }}>
                  {(result.market_reality?.competitor_snapshot || []).map((item, index) => (
                    <li key={index} style={{ marginBottom: 8 }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e8e4da", borderRadius: 16, padding: "24px 28px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Pivot generator</div>
              <div style={{ display: "grid", gap: 10 }}>
                {(result.pivot_advice || []).map((item, index) => (
                  <div key={index} style={{ borderRadius: 12, background: "#f8fafc", padding: "14px 16px", color: "#1f2937" }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* India insight */}
          <div style={{ background: "linear-gradient(135deg, #fff7ed, #faf8f3)", border: "1px solid #fed7aa", borderRadius: 16, padding: "20px 24px", marginBottom: 20, animation: "fadeUp .5s ease .4s both" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: SAFFRON2, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>🇮🇳 India-Specific Insight</div>
            <div style={{ fontSize: 14, color: "#1a1814", lineHeight: 1.7 }}><TypewriterText text={result.india_insight} speed={22} /></div>
          </div>

          {/* Next moves */}
          <div style={{ background: "#fff", border: "1px solid #e8e4da", borderRadius: 16, padding: "24px 28px", marginBottom: 20, animation: "fadeUp .5s ease .5s both" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Your next 3 moves this week</div>
            {result.next_3_moves.map((move, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: SAFFRON, color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: 14, color: "#2a2820", lineHeight: 1.6, paddingTop: 2 }}>{move}</div>
              </div>
            ))}
          </div>

          {/* Failure risk */}
          <div style={{ background: "#fff", border: "1px solid #fde68a", borderRadius: 16, padding: "24px 28px", marginBottom: 20, animation: "fadeUp .5s ease .55s both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#b45309", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Why startups fail</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1f2937" }}>{result.failure_risk?.level || 'Medium'} risk</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>{result.failure_risk?.reason || 'The biggest risks are execution clarity and market fit.'}</p>
            <ul style={{ marginTop: 14, paddingLeft: 18, color: "#334155" }}>
              {(result.failure_risk?.top_risks || []).map((risk, index) => (
                <li key={index} style={{ marginBottom: 8 }}>{risk}</li>
              ))}
            </ul>
          </div>

          {/* Shareable card */}
          <div style={{ animation: "fadeUp .5s ease .6s both" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Your shareable result card</div>
            <ShareCard idea={result.idea} scores={result.scores} verdict={result.verdict} />
          </div>

          {/* Pitch deck preview */}
          <div style={{ background: "#fff", border: "1px solid #e8e4da", borderRadius: 16, padding: "24px 28px", marginTop: 20, animation: "fadeUp .5s ease .65s both" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>AI pitch deck generator</div>
            <div style={{ display: "grid", gap: 12 }}>
              {(result.pitch_deck || []).map((slide, index) => (
                <div key={index} style={{ borderRadius: 14, background: "#f8fafc", padding: "18px 20px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{slide.title}</div>
                  <ul style={{ margin: 0, paddingLeft: 18, color: "#334155" }}>
                    {slide.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} style={{ marginBottom: 6 }}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setStep("form")} style={{ marginTop: 28, width: "100%", background: "#1a1814", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, padding: 14, borderRadius: 10, border: "none", cursor: "pointer" }}>
            Test another idea →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#faf8f3", minHeight: "100vh" }}>
      
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px" }}>

        {/* Hero */}
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 32, fontWeight: 800, color: "#1a1814", lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 10 }}>
            Can your idea survive<br /><span style={{ color: SAFFRON }}>a VC's grilling?</span>
          </div>
          <div style={{ fontSize: 15, color: "#6b6860", lineHeight: 1.65 }}>
            Get 5 brutal questions, a full SWOT, fundability scores,<br />and your next 3 moves — powered by Groq LPU API.
          </div>
        </div>

        {/* Form */}
        <div style={{ background: "#fff", border: "1px solid #e8e4da", borderRadius: 18, padding: "28px 28px 24px" }}>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Idea title *</label>
            <input style={inputStyle} placeholder="e.g. UPI-based micro-insurance for auto drivers" value={form.title} onChange={e => updateForm("title", e.target.value)} onFocus={e => e.target.style.borderColor = SAFFRON} onBlur={e => e.target.style.borderColor = "#e8e4da"} />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>What problem does it solve? *</label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="Describe the pain point clearly — who suffers, how often, how badly?" value={form.problem} onChange={e => updateForm("problem", e.target.value)} onFocus={e => e.target.style.borderColor = SAFFRON} onBlur={e => e.target.style.borderColor = "#e8e4da"} />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Your solution *</label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="How does your idea solve this? What makes it different?" value={form.solution} onChange={e => updateForm("solution", e.target.value)} onFocus={e => e.target.style.borderColor = SAFFRON} onBlur={e => e.target.style.borderColor = "#e8e4da"} />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Target market in India *</label>
            <input style={inputStyle} placeholder="e.g. Gig workers in Tier-2 cities, 18–35 years" value={form.market} onChange={e => updateForm("market", e.target.value)} onFocus={e => e.target.style.borderColor = SAFFRON} onBlur={e => e.target.style.borderColor = "#e8e4da"} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={{ ...inputStyle }} value={form.category} onChange={e => updateForm("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Stage</label>
              <select style={{ ...inputStyle }} value={form.stage} onChange={e => updateForm("stage", e.target.value)}>
                {STAGES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13, padding: "10px 14px", borderRadius: 8, marginBottom: 16 }}>{error}</div>}

          <button onClick={runAnalysis} style={{
            width: "100%", background: SAFFRON, color: "#fff",
            fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600,
            padding: "14px", borderRadius: 10, border: "none", cursor: "pointer",
            transition: ".2s", letterSpacing: "-0.2px"
          }}
            onMouseEnter={e => e.target.style.background = SAFFRON2}
            onMouseLeave={e => e.target.style.background = SAFFRON}
          >
            Stress-test my idea →
          </button>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {["5 brutal VC questions", "SWOT analysis", "Fundability score", "India-specific insights"].map(f => (
              <div key={f} style={{ fontSize: 11, color: "#9a9690", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#16a34a" }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>

        {/* Sample */}
        <div style={{ marginTop: 20, padding: "16px 20px", background: "#fff", border: "1px solid #e8e4da", borderRadius: 12, cursor: "pointer", transition: "all 0.2s" }}
          onClick={() => setForm({ title: "Mandi Price Alerts via WhatsApp", problem: "Farmers in rural India don't know real-time mandi prices and end up selling produce at 20-40% below market rates to local middlemen.", solution: "Send daily mandi price alerts via WhatsApp for the nearest 3 mandis. Farmers subscribe via a missed call. No app or data plan needed.", market: "Small & marginal farmers in UP, MP, Maharashtra — 100M+ people", category: "AgriTech", stage: "Just an idea" })}>
          <div style={{ fontSize: 11, color: "#9a9690", marginBottom: 4, fontWeight: "bold" }}>Try a sample idea →</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1814" }}>Mandi Price Alerts via WhatsApp</div>
        </div>

      </div>
    </div>
  );
}
