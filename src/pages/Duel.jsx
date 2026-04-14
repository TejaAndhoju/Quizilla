import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Timer, User, Users, ChevronRight } from 'lucide-react';

export default function Duel() {
  const navigate = useNavigate();
  const { matchConfig, matchState, submitAnswer, nextQuestion, startMatch, user } = useAppStore();
  
  const [timeLeft, setTimeLeft] = useState(15);
  const [countdown, setCountdown] = useState(3);
  const [p1Answer, setP1Answer] = useState(null);
  const [p2Answer, setP2Answer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  
  const timerRef = useRef(null);
  const q = matchState.questions[matchState.currentQuestionIndex];

  // Auto redirect if no questions loaded
  useEffect(() => {
    if (matchState.status === 'IDLE' || !q) {
      navigate('/lobby');
    }
  }, [matchState.status, q, navigate]);

  // Handle Initial Countdown
  useEffect(() => {
    if (matchState.status === 'COUNTDOWN') {
      const id = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(id);
            startMatch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(id);
    }
  }, [matchState.status, startMatch]);

  // Main Question Timer
  useEffect(() => {
    if (matchState.status === 'PLAYING' && !showResult) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            clearInterval(timerRef.current);
            handleReveal();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [matchState.status, showResult, matchState.currentQuestionIndex]);

  // Check if answered in PLAYING state
  useEffect(() => {
    if (matchState.status === 'PLAYING' && !showResult) {
      if (matchConfig.mode === 'SOLO') {
        if (p1Answer !== null) {
          handleReveal();
        }
      } else if (matchConfig.mode === 'LOCAL') {
        if (p1Answer !== null && p2Answer !== null) {
          handleReveal();
        }
      }
    }
  }, [p1Answer, p2Answer, matchState.status, showResult, matchConfig.mode]);

  const handleReveal = () => {
    clearInterval(timerRef.current);
    setShowResult(true);
    
    // Calculate final scores for this question
    if (p1Answer === q.correctIndex) {
      submitAnswer('p1', true, timeLeft);
    } else {
      submitAnswer('p1', false, 0);
    }
    
    if (matchConfig.mode !== 'SOLO') {
      if (p2Answer === q.correctIndex) {
        submitAnswer('p2', true, timeLeft); 
      } else {
        submitAnswer('p2', false, 0);
      }
    }
  };

  const handleNext = () => {
    setP1Answer(null);
    setP2Answer(null);
    setShowResult(false);
    setTimeLeft(15);
    nextQuestion();
  };

  useEffect(() => {
    if(matchState.status === 'RESULTS') {
       navigate('/results');
    }
  }, [matchState.status, navigate]);

  const onSelectOptionP1 = (idx) => {
    if (p1Answer === null && !showResult) {
      setP1Answer(idx);
    }
  };

  const onSelectOptionP2 = (idx) => {
    if (matchConfig.mode === 'LOCAL' && p2Answer === null && !showResult) {
      setP2Answer(idx);
    }
  }

  if (matchState.status === 'COUNTDOWN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-center animate-bounce">
          <h2 className="text-8xl font-black text-brand text-gradient">{countdown}</h2>
          <p className="text-xl text-slate-400 mt-4 uppercase tracking-widest">Get Ready</p>
        </div>
      </div>
    );
  }

  if (matchState.status !== 'PLAYING' && matchState.status !== 'RESULTS') return null;

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto p-4 md:p-6">
      {/* Top Bar - Scores */}
      <header className="flex justify-between items-center mb-8 bg-dark-surface p-4 rounded-2xl border border-dark-border shadow-lg">
        {/* P1 */}
        <div className="flex items-center gap-3 w-1/3">
          <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-slate-200">{user.username}</p>
            <p className="text-2xl font-black text-indigo-400">{matchState.p1Score}</p>
          </div>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center w-1/3 text-center">
          <div className="flex items-center justify-center gap-2 text-brand mb-1">
            <Timer className="w-5 h-5" />
            <span className="font-bold tracking-widest uppercase text-xs">Time</span>
          </div>
          <div className={`text-4xl font-black ${timeLeft <= 5 ? 'text-error animate-pulse' : 'text-white'}`}>
            {timeLeft}
          </div>
        </div>

        {/* P2 (Hidden in Solo mode) */}
        <div className="w-1/3 flex justify-end">
          {matchConfig.mode !== 'SOLO' && (
            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="font-bold text-slate-200">Player 2</p>
                <p className="text-2xl font-black text-pink-400">{matchState.p2Score}</p>
              </div>
              <div className="w-12 h-12 bg-pink-500/20 text-pink-400 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Question Card */}
      <main className="flex-1 flex flex-col mt-4">
        <div className="text-center mb-2">
          <span className="text-sm font-semibold text-brand tracking-widest uppercase">
            Question {matchState.currentQuestionIndex + 1} of {matchState.questions.length}
          </span>
        </div>
        
        <div className="glass-panel p-8 rounded-3xl mb-8 border-brand/20">
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-6 leading-relaxed">
            {q?.text}
          </h2>
          {q?.codeSnippet && (
            <div className="bg-dark-bg p-4 rounded-xl text-left overflow-x-auto border border-dark-border mb-6">
              <pre className="text-sm text-blue-300"><code>{q.codeSnippet}</code></pre>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {q?.options.map((option, idx) => {
            let isCorrectOption = showResult && idx === q.correctIndex;
            let isP1Selected = p1Answer === idx;
            let isP2Selected = p2Answer === idx;

            let btnClass = "relative p-5 rounded-2xl border-2 transition-all text-lg font-medium text-left ";
            
            if (showResult) {
              if (isCorrectOption) btnClass += "bg-success/20 border-success text-success shadow-[0_0_20px_rgba(16,185,129,0.2)]";
              else if (isP1Selected && !isCorrectOption) btnClass += "bg-error/20 border-error text-error";
              else btnClass += "bg-dark-surface border-dark-border text-slate-500 opacity-50";
            } else {
               btnClass += isP1Selected ? "bg-indigo-500/20 border-indigo-500 text-white" : "bg-dark-surface border-dark-border hover:border-brand/50 hover:bg-dark-surface-elevated text-slate-200 cursor-pointer";
            }

            return (
              <button 
                key={idx}
                disabled={showResult || p1Answer !== null}
                onClick={() => onSelectOptionP1(idx)}
                className={btnClass}
              >
                {option}
                {/* P1 Badge */}
                {isP1Selected && <div className="absolute -top-3 right-4 bg-indigo-500 text-xs px-2 py-1 rounded-full text-white font-bold shadow-lg">P1</div>}
                
                {/* P2 Badge */}
                {isP2Selected && matchConfig.mode !== 'SOLO' && <div className="absolute -bottom-3 right-4 bg-pink-500 text-xs px-2 py-1 rounded-full text-white font-bold shadow-lg shadow-pink-500/50">P2</div>}
              </button>
            )
          })}
        </div>
        
        {/* Local Multiplayer P2 Actions Overlay */}
        {matchConfig.mode === 'LOCAL' && !showResult && p2Answer === null && (
           <div className="mt-8 p-4 bg-dark-surface border border-pink-500/30 rounded-xl text-center shadow-[0_0_15px_rgba(236,72,153,0.1)]">
             <p className="text-pink-400 mb-2 font-semibold">Player 2 Options</p>
             <div className="flex gap-2 justify-center">
                {q?.options.map((_, idx) => (
                  <button key={'p2'+idx} onClick={() => onSelectOptionP2(idx)} className="w-12 h-12 rounded-full bg-dark-bg border border-dark-border hover:border-pink-500 text-slate-300 font-bold">{idx+1}</button>
                ))}
             </div>
           </div>
        )}

        {showResult && (
          <div className="mt-8 flex justify-center animate-in slide-in-from-bottom-4 fade-in">
            <button onClick={handleNext} className="btn-primary w-full md:w-auto px-12 py-4 text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(170,59,255,0.4)]">
              {matchState.currentQuestionIndex === matchState.questions.length - 1 ? 'See Results' : 'Next Question'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
