import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

import { DifficultyLevel, DifficultyConfig, GuessRecord, GameStatus, GameStats } from './types';
import { sound } from './utils/sound';
import { Header } from './components/Header';
import { RangeBar } from './components/RangeBar';
import { GuessInput } from './components/GuessInput';
import { FeedbackBanner } from './components/FeedbackBanner';
import { HistoryList } from './components/HistoryList';
import { PythonCodeModal } from './components/PythonCodeModal';
import { VictoryModal } from './components/VictoryModal';

const DIFFICULTIES: Record<DifficultyLevel, DifficultyConfig> = {
  easy: { id: 'easy', name: 'Easy', min: 1, max: 50, description: 'Quick & casual (1-50)' },
  standard: { id: 'standard', name: 'Standard', min: 1, max: 100, description: 'Classic Python script range (1-100)' },
  hard: { id: 'hard', name: 'Hard', min: 1, max: 250, description: 'Challenging spectrum (1-250)' },
  extreme: { id: 'extreme', name: 'Extreme', min: 1, max: 500, description: 'Expert deduction (1-500)' },
  custom: { id: 'custom', name: 'Custom', min: 1, max: 100, description: 'Custom min and max bounds' },
};

export default function App() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('standard');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isLimitedAttempts, setIsLimitedAttempts] = useState<boolean>(false);
  const [maxAttempts, setMaxAttempts] = useState<number>(7);

  // Target and active bounds
  const [targetNumber, setTargetNumber] = useState<number>(50);
  const [possibleMin, setPossibleMin] = useState<number>(1);
  const [possibleMax, setPossibleMax] = useState<number>(100);

  // Gameplay state
  const [history, setHistory] = useState<GuessRecord[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('IDLE');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);

  // Saved stats in LocalStorage
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem('number_guessing_game_stats');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      bestScoreStandard: null,
      currentStreak: 0,
      bestStreak: 0,
    };
  });

  // Save stats to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('number_guessing_game_stats', JSON.stringify(stats));
    } catch {
      // Ignore quota errors
    }
  }, [stats]);

  const cfg = DIFFICULTIES[difficulty];

  // Initialize or reset a game round
  const startNewGame = useCallback((diffLevel?: DifficultyLevel) => {
    const activeDiff = diffLevel || difficulty;
    const activeCfg = DIFFICULTIES[activeDiff];

    // Python equivalent: S_NUM = random.randint(min, max)
    const newTarget = Math.floor(Math.random() * (activeCfg.max - activeCfg.min + 1)) + activeCfg.min;

    setTargetNumber(newTarget);
    setPossibleMin(activeCfg.min);
    setPossibleMax(activeCfg.max);
    setHistory([]);
    setGameStatus('IDLE');
    setIsVictoryModalOpen(false);
    setIsNewBest(false);

    // Calculate recommended max attempts for limited mode (Binary search = log2(range) + 1)
    const totalRange = activeCfg.max - activeCfg.min + 1;
    const recTries = Math.ceil(Math.log2(totalRange)) + 2;
    setMaxAttempts(recTries);
  }, [difficulty]);

  // Initial load
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Difficulty change handler
  const handleSetDifficulty = (level: DifficultyLevel) => {
    setDifficulty(level);
    startNewGame(level);
  };

  // Submit a guess handler
  const handleGuessSubmit = (guessNum: number) => {
    const attemptNumber = history.length + 1;
    const totalRange = cfg.max - cfg.min;
    
    // Proximity calculation (0 to 100% proximity to secret target)
    const distance = Math.abs(guessNum - targetNumber);
    const proximityPercent = Math.max(0, Math.round(100 - (distance / totalRange) * 100));

    let result: 'TOO_LOW' | 'TOO_HIGH' | 'CORRECT' = 'CORRECT';
    let newPossibleMin = possibleMin;
    let newPossibleMax = possibleMax;

    if (guessNum === targetNumber) {
      result = 'CORRECT';
    } else if (guessNum < targetNumber) {
      result = 'TOO_LOW';
      newPossibleMin = Math.max(possibleMin, guessNum + 1);
    } else {
      result = 'TOO_HIGH';
      newPossibleMax = Math.min(possibleMax, guessNum - 1);
    }

    setPossibleMin(newPossibleMin);
    setPossibleMax(newPossibleMax);

    const record: GuessRecord = {
      guess: guessNum,
      result,
      timestamp: Date.now(),
      attemptNumber,
      possibleMin: newPossibleMin,
      possibleMax: newPossibleMax,
      proximityPercent,
    };

    const newHistory = [...history, record];
    setHistory(newHistory);

    // Check Win / Lose conditions
    if (result === 'CORRECT') {
      sound.playWin();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });

      setGameStatus('WON');
      setIsVictoryModalOpen(true);

      // Stats update
      let newBest = false;
      setStats((prev) => {
        const isStandard = difficulty === 'standard';
        const bestScore = isStandard
          ? prev.bestScoreStandard === null
            ? attemptNumber
            : Math.min(prev.bestScoreStandard, attemptNumber)
          : prev.bestScoreStandard;

        if (isStandard && (prev.bestScoreStandard === null || attemptNumber < prev.bestScoreStandard)) {
          newBest = true;
        }

        const streak = prev.currentStreak + 1;
        return {
          gamesPlayed: prev.gamesPlayed + 1,
          gamesWon: prev.gamesWon + 1,
          bestScoreStandard: bestScore,
          currentStreak: streak,
          bestStreak: Math.max(prev.bestStreak, streak),
        };
      });

      setIsNewBest(newBest);

    } else {
      // Check if limited attempts expired
      if (isLimitedAttempts && attemptNumber >= maxAttempts) {
        sound.playGameOver();
        setGameStatus('LOST');
        setStats((prev) => ({
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          currentStreak: 0,
        }));
      } else {
        setGameStatus('PLAYING');
        if (result === 'TOO_LOW') {
          sound.playTooLow();
        } else {
          sound.playTooHigh();
        }
      }
    }
  };

  const lastRecord = history.length > 0 ? history[history.length - 1] : null;
  const attemptsLeft = maxAttempts - history.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Top Navigation / App Bar */}
      <Header
        difficulty={difficulty}
        setDifficulty={handleSetDifficulty}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
        onResetGame={() => startNewGame()}
        stats={stats}
        isLimitedAttempts={isLimitedAttempts}
        setIsLimitedAttempts={setIsLimitedAttempts}
        attemptsLeft={attemptsLeft}
        maxAttempts={maxAttempts}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col gap-6">
        
        {/* Feedback Banner (Top response card) */}
        <FeedbackBanner
          lastRecord={lastRecord}
          targetNumber={targetNumber}
          gameStatus={gameStatus}
        />

        {/* Dynamic Range Spectrum Bar */}
        <RangeBar
          minLimit={cfg.min}
          maxLimit={cfg.max}
          possibleMin={possibleMin}
          possibleMax={possibleMax}
          lastGuess={lastRecord ? lastRecord.guess : null}
        />

        {/* Interactive Input Component */}
        <GuessInput
          onGuessSubmit={handleGuessSubmit}
          disabled={gameStatus === 'WON' || gameStatus === 'LOST'}
          minPossible={possibleMin}
          maxPossible={possibleMax}
          minLimit={cfg.min}
          maxLimit={cfg.max}
        />

        {/* Guess History log */}
        <HistoryList history={history} />

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 font-mono">
        Number Guessing Game Web App • Converted from Python script using React & Tailwind CSS
      </footer>

      {/* Victory Celebration Modal */}
      <VictoryModal
        isOpen={isVictoryModalOpen}
        targetNumber={targetNumber}
        attemptsCount={history.length}
        difficultyName={cfg.name}
        onPlayAgain={() => startNewGame()}
        isNewBest={isNewBest}
      />

      {/* Python Code Viewer Modal */}
      <PythonCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

    </div>
  );
}
