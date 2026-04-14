import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Users, ArrowLeft, Play, Settings } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { categories, questions } from '../data/questions';

export default function Lobby() {
  const navigate = useNavigate();
  const { matchConfig, setMatchConfig, initMatch } = useAppStore();

  const handleStart = () => {
    // Filter questions by category
    let availableQuestions = questions.filter(q => q.category === matchConfig.category);
    if(availableQuestions.length === 0) {
      // fallback
      availableQuestions = questions;
    }
    // Shuffle and pick up to 5
    const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    const selectedQ = shuffled.slice(0, 5);
    
    initMatch(selectedQ);
    navigate('/duel');
  }

  return (
    <div className="min-h-screen py-10 px-6 max-w-3xl mx-auto flex flex-col">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors self-start mb-8">
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <h1 className="text-4xl font-extrabold text-white mb-8">Match Setup</h1>

      <div className="space-y-8">
        {/* Mode Selection */}
        <section>
          <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand" /> Game Mode
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setMatchConfig({ mode: 'SOLO' })}
              className={`glass-panel p-6 rounded-2xl flex flex-col items-center gap-3 transition-all ${matchConfig.mode === 'SOLO' ? 'border-brand shadow-[0_0_15px_rgba(170,59,255,0.2)] bg-brand/10' : ''}`}
            >
              <BookOpen className={`w-8 h-8 ${matchConfig.mode === 'SOLO' ? 'text-brand' : 'text-slate-400'}`} />
              <span className="font-semibold">Solo Practice</span>
            </button>
            <button 
              onClick={() => setMatchConfig({ mode: 'LOCAL' })}
              className={`glass-panel p-6 rounded-2xl flex flex-col items-center gap-3 transition-all ${matchConfig.mode === 'LOCAL' ? 'border-brand shadow-[0_0_15px_rgba(170,59,255,0.2)] bg-brand/10' : ''}`}
            >
              <Users className={`w-8 h-8 ${matchConfig.mode === 'LOCAL' ? 'text-brand' : 'text-slate-400'}`} />
              <span className="font-semibold">Local Duel (1v1)</span>
            </button>
          </div>
        </section>

        {/* Category Selection */}
        <section>
          <h2 className="text-xl font-bold text-slate-200 mb-4">Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setMatchConfig({ category: cat })}
                className={`py-2 px-5 rounded-full font-medium transition-colors ${matchConfig.category === cat ? 'bg-slate-100 text-slate-900 shadow-lg' : 'bg-dark-surface border border-dark-border text-slate-300 hover:bg-dark-surface-elevated'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

      </div>

      <div className="mt-auto pt-10">
        <button onClick={handleStart} className="btn-primary w-full text-xl flex justify-center items-center gap-2">
          <Play className="w-6 h-6 fill-white" />
          {matchConfig.mode === 'SOLO' ? 'Start Practice' : 'Start Duel'}
        </button>
      </div>
    </div>
  );
}
