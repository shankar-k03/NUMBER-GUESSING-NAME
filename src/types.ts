export type DifficultyLevel = 'easy' | 'standard' | 'hard' | 'extreme' | 'custom';

export interface DifficultyConfig {
  id: DifficultyLevel;
  name: string;
  min: number;
  max: number;
  maxAttempts?: number;
  description: string;
}

export interface GuessRecord {
  guess: number;
  result: 'TOO_LOW' | 'TOO_HIGH' | 'CORRECT';
  timestamp: number;
  attemptNumber: number;
  possibleMin: number;
  possibleMax: number;
  proximityPercent: number; // 0 to 100% hotness
}

export type GameStatus = 'IDLE' | 'PLAYING' | 'WON' | 'LOST';

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestScoreStandard: number | null; // Fewest guesses for standard
  currentStreak: number;
  bestStreak: number;
}
