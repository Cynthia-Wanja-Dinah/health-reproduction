import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardCheck, ArrowRight, ArrowLeft, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { getContraceptiveRecommendation, RecommendationInput } from '../lib/gemini';

const STEPS = [
  { id: 'start', title: 'Start Adviser' },
  { id: 'age', title: 'How old are you?' },
  { id: 'gender', title: 'Your gender' },
  { id: 'activity', title: 'Sexual Activity' },
  { id: 'prefs', title: 'Your Preferences' },
  { id: 'result', title: 'Your Plan' }
];

export default function RecommendationForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [data, setData] = useState<RecommendationInput>({
    age: 18,
    gender: 'female',
    sexualActivity: 'active',
    preferences: []
  });

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    setStep(STEPS.length - 1); // Move to results step
    try {
      const res = await getContraceptiveRecommendation(data);
      setRecommendation(res);
    } catch (err) {
      setRecommendation("Sorry, I couldn't generate a report right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePref = (pref: string) => {
    setData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref) 
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {STEPS.map((s, i) => (
            <div 
              key={s.id} 
              className={`h-1 flex-1 mx-1 rounded-full transition-all ${i <= step ? 'bg-sage-600' : 'bg-sage-100'}`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold text-slate-800">{STEPS[step].title}</h2>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card p-8 min-h-[300px] flex flex-col justify-center"
        >
          {step === 0 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-sage-100 text-sage-600 rounded-full flex items-center justify-center mx-auto">
                <ClipboardCheck size={40} />
              </div>
              <p className="text-slate-500">
                Answer 4 simple questions anonymously to find the best contraceptive methods for your lifestyle.
              </p>
              <button onClick={next} className="w-full bg-sage-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-sage-700 transition-all">
                START NOW <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <input 
                type="range" min="15" max="60" value={data.age} 
                onChange={e => setData(d => ({ ...d, age: parseInt(e.target.value) }))}
                className="w-full h-2 bg-sage-100 rounded-lg appearance-none cursor-pointer accent-sage-600"
              />
              <p className="text-center text-4xl font-black text-sage-600">{data.age}</p>
              <button onClick={next} className="w-full bg-sage-600 text-white font-bold py-4 rounded-2xl">Next</button>
              <button onClick={prev} className="w-full text-slate-400 text-sm font-bold">Go Back</button>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              {['female', 'male', 'other', 'prefer_not_to_say'].map(g => (
                <button
                  key={g}
                  onClick={() => { setData(d => ({ ...d, gender: g })); next(); }}
                  className={`p-4 rounded-2xl border-2 font-bold capitalize transition-all ${data.gender === g ? 'border-sage-600 bg-sage-50 text-sage-600' : 'border-slate-100 text-slate-500 hover:border-sage-200'}`}
                >
                  {g.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              {[
                { id: 'active', label: 'Sexually Active' },
                { id: 'occasional', label: 'Occasional Activity' },
                { id: 'none', label: 'Not Planning Activity' }
              ].map(a => (
                <button
                  key={a.id}
                  onClick={() => { setData(d => ({ ...d, sexualActivity: a.id })); next(); }}
                  className={`w-full p-6 rounded-2xl border-2 font-bold flex items-center justify-between transition-all ${data.sexualActivity === a.id ? 'border-sage-600 bg-sage-50 text-sage-600' : 'border-slate-100 text-slate-500'}`}
                >
                  {a.label}
                  {data.sexualActivity === a.id && <CheckCircle2 size={24} />}
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <p className="text-sm text-slate-400 mb-4 italic">Select all that apply:</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  'Long-term (1-5 years)',
                  'Daily/Short-term',
                  'Non-hormonal',
                  'Low maintenance',
                  'Protects against STIs'
                ].map(p => (
                  <button
                    key={p}
                    onClick={() => togglePref(p)}
                    className={`text-left p-4 rounded-2xl border-2 font-bold transition-all ${data.preferences.includes(p) ? 'border-sage-600 bg-sage-50 text-sage-600 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-sage-200'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button onClick={handleSubmit} className="w-full bg-sage-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
                GENERATE MY PLAN <Sparkles size={20} />
              </button>
              <button onClick={prev} className="w-full text-slate-400 text-sm font-bold">Go Back</button>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4 text-slate-400">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Sparkles size={40} className="text-sage-600" />
                  </motion.div>
                  <p className="font-bold flex flex-col items-center">
                    Analyzing your profile...
                    <span className="text-xs font-normal">Our AI is generating a tailored list.</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="prose prose-slate max-w-none text-sm text-slate-600">
                    <p className="whitespace-pre-wrap leading-relaxed">{recommendation}</p>
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-slate-50">
                    <button 
                      onClick={() => setStep(0)}
                      className="flex-1 border-2 border-sage-600 text-sage-600 font-bold py-3 rounded-2xl hover:bg-sage-50 transition-all"
                    >
                      Retake
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="flex-1 bg-sage-600 text-white font-bold py-3 rounded-2xl hover:bg-sage-700 transition-all"
                    >
                      Save/Print
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-slate-400 italic">
                    Note: Always visit a nurse or doctor before starting a new method.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
