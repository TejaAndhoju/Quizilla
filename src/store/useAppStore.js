import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // User Profile
  user: {
    username: 'Player 1',
    xp: 1200,
    streak: 3
  },
  
  updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),

  // Match Config
  matchConfig: {
    mode: 'SOLO', // 'SOLO' | 'LOCAL' (future: 'ONLINE')
    category: 'DSA'
  },
  
  setMatchConfig: (config) => set((state) => ({ matchConfig: { ...state.matchConfig, ...config } })),

  // Match State
  matchState: {
    status: 'IDLE', // IDLE, COUNTDOWN, PLAYING, RESULTS
    questions: [],
    currentQuestionIndex: 0,
    p1Score: 0,
    p2Score: 0,
    winner: null,
  },

  initMatch: (questions) => set({
    matchState: {
      status: 'COUNTDOWN',
      questions,
      currentQuestionIndex: 0,
      p1Score: 0,
      p2Score: 0,
      winner: null
    }
  }),

  startMatch: () => set((state) => ({
    matchState: { ...state.matchState, status: 'PLAYING' }
  })),

  submitAnswer: (player, isCorrect, timeRemaining) => set((state) => {
    const points = isCorrect ? 100 + (timeRemaining * 10) : 0;
    return {
      matchState: {
        ...state.matchState,
        [`${player}Score`]: state.matchState[`${player}Score`] + points
      }
    };
  }),

  nextQuestion: () => set((state) => {
    const nextIdx = state.matchState.currentQuestionIndex + 1;
    if (nextIdx >= state.matchState.questions.length) {
      // End game
      const { p1Score, p2Score } = state.matchState;
      let winner;
      if (get().matchConfig.mode === 'SOLO') {
        winner = 'Player 1'; // Irrelevant in solo, but needed for state consistency
      } else {
        winner = 'Draw';
        if (p1Score > p2Score) winner = 'Player 1';
        if (p2Score > p1Score) winner = 'Player 2';
      }
      
      return {
        matchState: {
          ...state.matchState,
          status: 'RESULTS',
          winner
        }
      };
    }
    
    return {
      matchState: {
        ...state.matchState,
        currentQuestionIndex: nextIdx
      }
    };
  }),
  
  endMatch: () => set((state) => ({
    matchState: { ...state.matchState, status: 'IDLE' }
  }))
}));
