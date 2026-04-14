import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Trophy, RefreshCcw, Home, Award, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Results() {
  const navigate = useNavigate();
  const { matchState, matchConfig, user, updateUser, endMatch } = useAppStore();
  const [xpGained, setXpGained] = useState(0);

  useEffect(() => {
    if (matchState.status !== 'RESULTS') {
      navigate('/');
      return;
    }

    const { p1Score, p2Score } = matchState;
    let gained = 0;
    let isWin = false;
    
    if (matchConfig.mode === 'SOLO') {
      // In solo mode, XP is purely based on score
      gained = Math.floor(p1Score / 10);
      isWin = true; // Always celebrate completion
    } else {
      if (p1Score > p2Score) {
        gained = 50; // Win
        isWin = true;
      } else if (p1Score === p2Score) {
        gained = 10; // Draw
      } else {
        gained = 5; // Loss
      }
    }

    setXpGained(gained);
    updateUser({ 
      xp: user.xp + gained,
      streak: isWin ? user.streak + 1 : 0
    });

    if (isWin || matchConfig.mode === 'SOLO') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#aa3bff', '#10b981', '#ffffff']
      });
    }
  }, []);

  if (matchState.status !== 'RESULTS') return null;

  const isWin = matchState.p1Score > matchState.p2Score;
  const isDraw = matchState.p1Score === matchState.p2Score;
  const isSolo = matchConfig.mode === 'SOLO';

  const handleHome = () => {
    endMatch();
    navigate('/');
  }

  return (
    <div className="min-h-screen py-10 px-6 flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
      
      <div className="mb-8">
        <div className={`inline-flex p-6 rounded-full ${isSolo ? 'bg-brand/20 text-brand' : isWin ? 'bg-success/20 text-success' : isDraw ? 'bg-warning/20 text-warning' : 'bg-error/20 text-error'} mb-6`}>
          {isSolo ? <CheckCircle className="w-16 h-16" /> : isWin ? <Trophy className="w-16 h-16" /> : <Award className="w-16 h-16" />}
        </div>
        <h1 className="text-5xl font-black text-white mb-2">
          {isSolo ? 'Practice Complete!' : isWin ? 'Victory!' : isDraw ? "It's a Draw" : 'Defeat'}
        </h1>
        <p className="text-xl text-slate-400">{isSolo ? 'Great job answering those.' : 'Match Completed'}</p>
      </div>

      <div className="glass-panel w-full p-8 rounded-3xl mb-8 flex justify-center items-center">
        {isSolo ? (
          <div className="text-center">
            <p className="text-slate-400 mb-1 font-medium text-sm">Final Score</p>
            <p className="text-5xl font-extrabold text-brand">{matchState.p1Score}</p>
          </div>
        ) : (
          <>
            <div className="text-center w-1/3">
              <p className="text-slate-400 mb-1 font-medium text-sm">Player 1</p>
              <p className="text-4xl font-extrabold text-indigo-400">{matchState.p1Score}</p>
            </div>
            
            <div className="px-6 relative w-1/3 text-center">
               <div className="absolute inset-x-0 top-1/2 h-px bg-dark-border -z-10"></div>
               <span className="bg-dark-surface px-4 py-1 rounded-full text-slate-500 font-bold border border-dark-border text-sm">VS</span>
            </div>

            <div className="text-center w-1/3">
              <p className="text-slate-400 mb-1 font-medium text-sm">Player 2</p>
              <p className="text-4xl font-extrabold text-pink-400">{matchState.p2Score}</p>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-4 w-full mb-12">
        <div className="flex justify-between items-center bg-dark-surface-elevated p-4 rounded-xl border border-dark-border shadow-inner">
          <span className="text-slate-300 font-medium">XP Earned</span>
          <span className="text-brand font-bold text-xl">+{xpGained} XP</span>
        </div>
        <div className="flex justify-between items-center bg-dark-surface-elevated p-4 rounded-xl border border-dark-border shadow-inner">
          <span className="text-slate-300 font-medium">Current Streak</span>
          <span className="text-warning font-bold text-xl">{isSolo ? user.streak : (isWin ? user.streak + 1 : 0)} 🔥</span>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button onClick={handleHome} className="btn-secondary flex-1 flex items-center justify-center gap-2">
          <Home className="w-5 h-5" /> Home
        </button>
        <button onClick={() => { endMatch(); navigate('/lobby'); }} className="btn-primary flex-1 flex items-center justify-center gap-2">
          <RefreshCcw className="w-5 h-5" /> {isSolo ? 'Practice Again' : 'Play Again'}
        </button>
      </div>

    </div>
  );
}
