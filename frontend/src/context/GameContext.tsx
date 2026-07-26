'use client';
/**
 * GameContext — global client-side state for the learner session.
 * Wraps the app with XP, hearts, streak, and user data.
 * Uses useReducer for predictable state transitions.
 */
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { getUser } from '@/lib/api';
import type { User } from '@/types';

// ── State shape ──────────────────────────────────────────────────────────────

interface GameState {
  userId: number;
  username: string;
  avatarUrl: string | null;
  totalXp: number;
  weeklyXp: number;
  hearts: number;
  maxHearts: number;
  streak: number;
  gems: number;      // mocked — always 975
  loaded: boolean;
}

const initialState: GameState = {
  userId: 1,
  username: 'learner',
  avatarUrl: null,
  totalXp: 0,
  weeklyXp: 0,
  hearts: 5,
  maxHearts: 5,
  streak: 0,
  gems: 975,
  loaded: false,
};

// ── Actions ───────────────────────────────────────────────────────────────────

type Action =
  | { type: 'LOAD_USER'; payload: User }
  | { type: 'ADD_XP'; amount: number }
  | { type: 'LOSE_HEART' }
  | { type: 'REFILL_HEARTS' }
  | { type: 'SET_HEARTS'; count: number };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'LOAD_USER':
      return {
        ...state,
        username: action.payload.username,
        avatarUrl: action.payload.avatar_url,
        totalXp: action.payload.total_xp,
        weeklyXp: action.payload.total_xp, // approximation until leaderboard loaded
        hearts: action.payload.hearts?.count ?? 5,
        maxHearts: action.payload.hearts?.max_hearts ?? 5,
        streak: action.payload.streak?.current_streak ?? 0,
        loaded: true,
      };
    case 'ADD_XP':
      return { ...state, totalXp: state.totalXp + action.amount, weeklyXp: state.weeklyXp + action.amount };
    case 'LOSE_HEART':
      return { ...state, hearts: Math.max(0, state.hearts - 1) };
    case 'REFILL_HEARTS':
      return { ...state, hearts: state.maxHearts };
    case 'SET_HEARTS':
      return { ...state, hearts: action.count };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface GameContextValue {
  state: GameState;
  addXp: (amount: number) => void;
  loseHeart: () => void;
  refillHearts: () => void;
  setHearts: (count: number) => void;
  reload: () => Promise<void>;
}

const GameContext = createContext<GameContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const reload = useCallback(async () => {
    try {
      const user = await getUser(1);
      dispatch({ type: 'LOAD_USER', payload: user });
    } catch (e) {
      console.error('Failed to load user:', e);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addXp     = (amount: number)  => dispatch({ type: 'ADD_XP', amount });
  const loseHeart = ()                => dispatch({ type: 'LOSE_HEART' });
  const refillHearts = ()             => dispatch({ type: 'REFILL_HEARTS' });
  const setHearts = (count: number)   => dispatch({ type: 'SET_HEARTS', count });

  return (
    <GameContext.Provider value={{ state, addXp, loseHeart, refillHearts, setHearts, reload }}>
      {children}
    </GameContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}
