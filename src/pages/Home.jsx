import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Trophy, Flame, User } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Home() {
  const navigate = useNavigate();
  const user = useAppStore(state => state.user);

  return (
    <div className="min-h-screen py-10 px-6 flex flex-col max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <Zap className="text-brand w-8 h-8" />
          <h1 className="text-3xl font-bold text-white tracking-tight">Quizilla</h1>
        </div>
        <div className="flex items-center gap-4 bg-dark-surface py-2 px-4 rounded-full border border-dark-border">
          <div className="flex items-center gap-2 mr-4">
            <User className="text-slate-400 w-5 h-5" />
            <span className="font-medium text-slate-200">{user.username}</span>
          </div>
          <div className="flex items-center gap-1.5 text-warning">
            <Flame className="w-5 h-5" />
            <span className="font-bold">{user.streak}</span>
          </div>
          <div className="h-6 w-px bg-dark-border mx-2"></div>
          <div className="flex items-center gap-1.5 text-brand">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">{user.xp} XP</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center mt-8">
        <div className="inline-block px-4 py-1.5 rounded-full bg-brand-light text-brand text-sm font-semibold mb-6">
          Phase 1 MVP Available
        </div>
        <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          Challenge, Duel <br />
          <span className="text-gradient">Level Up.</span>
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
          Put your coding skills to the test in fast-paced battles. 
          Use Solo Practice to hone your skills, then Duel a friend locally!
        </p>

        <button 
          onClick={() => navigate('/lobby')}
          className="btn-primary text-xl px-10 py-4 flex items-center gap-3 animate-pulse-slow"
        >
          <Zap className="w-6 h-6 fill-white" />
          Enter the Arena
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24">
          {[
            { title: '10+ Categories', desc: 'DSA, React, C++, Python & more' },
            { title: 'Fast-Paced', desc: '15 seconds per question. Speed wins.' },
            { title: 'Solo Practice', desc: 'Harden your skills before dueling online' }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center hover:scale-105 transition-transform cursor-default">
              <h3 className="text-white font-bold text-xl mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
