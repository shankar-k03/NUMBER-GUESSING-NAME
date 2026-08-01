import React from 'react';
import { ArrowUp, ArrowDown, CheckCircle2, Flame, Snowflake, Sparkles } from 'lucide-react';
import { GuessRecord } from '../types';

interface FeedbackBannerProps {
  lastRecord: GuessRecord | null;
  targetNumber: number | null;
  gameStatus: 'IDLE' | 'PLAYING' | 'WON' | 'LOST';
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  lastRecord,
  targetNumber,
  gameStatus,
}) => {
  if (gameStatus === 'IDLE' && !lastRecord) {
    return (
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 font-sans">
        <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80 animate-bounce" />
        <h3 className="font-semibold text-slate-200 text-base mb-1">Ready to Play?</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          The computer has picked a random secret number. Enter your first guess above to begin!
        </p>
      </div>
    );
  }

  if (gameStatus === 'LOST') {
    return (
      <div className="w-full bg-rose-950/40 border-2 border-rose-500/50 rounded-2xl p-6 text-center shadow-lg animate-fade-in">
        <div className="inline-flex p-3 rounded-full bg-rose-500/20 text-rose-400 mb-3 border border-rose-500/30">
          <ArrowDown className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-wide mb-1 font-mono">GAME OVER!</h2>
        <p className="text-sm text-rose-200 mb-3">You ran out of attempts for this round.</p>
        <div className="inline-block bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-base font-mono font-bold text-amber-400">
          Secret Number Was: <span className="text-white text-xl">{targetNumber}</span>
        </div>
      </div>
    );
  }

  if (!lastRecord) return null;

  const { result, guess, proximityPercent } = lastRecord;

  // Temperature / Proximity indicator
  const getProximityText = (pct: number) => {
    if (pct >= 95) return { label: 'BURNING HOT! 🔥🔥🔥', color: 'text-rose-400' };
    if (pct >= 80) return { label: 'VERY WARM! 🔥', color: 'text-amber-400' };
    if (pct >= 50) return { label: 'WARM ☀️', color: 'text-yellow-400' };
    if (pct >= 25) return { label: 'COOL 🌬️', color: 'text-cyan-400' };
    return { label: 'FREEZING COLD! ❄️', color: 'text-blue-400' };
  };

  const proxInfo = getProximityText(proximityPercent);

  if (result === 'CORRECT') {
    return (
      <div className="w-full bg-gradient-to-r from-emerald-950/80 via-teal-950/80 to-emerald-950/80 border-2 border-emerald-500 rounded-2xl p-6 text-center shadow-xl shadow-emerald-500/10 animate-fade-in">
        <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-3 border border-emerald-500/40 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono tracking-tight mb-2">
          CONGRATULATION YOUR GUESSING IS RIGHT! 🎉
        </h2>
        <p className="text-sm text-emerald-100 font-medium">
          You guessed the secret number <span className="font-bold font-mono text-emerald-300 underline text-base">{guess}</span> correctly!
        </p>
      </div>
    );
  }

  const isTooLow = result === 'TOO_LOW';

  return (
    <div
      key={`${guess}-${lastRecord.timestamp}`}
      className={`w-full border-2 rounded-2xl p-6 text-center shadow-lg transition-all duration-300 animate-fade-in ${
        isTooLow
          ? 'bg-blue-950/40 border-blue-500/50 shadow-blue-500/5'
          : 'bg-purple-950/40 border-purple-500/50 shadow-purple-500/5'
      }`}
    >
      <div className="flex items-center justify-center gap-3 mb-2">
        <div
          className={`p-3 rounded-2xl font-bold border ${
            isTooLow
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
              : 'bg-purple-500/20 text-purple-400 border-purple-500/40'
          }`}
        >
          {isTooLow ? <ArrowUp className="w-8 h-8 animate-bounce" /> : <ArrowDown className="w-8 h-8 animate-bounce" />}
        </div>
      </div>

      {/* Main Python exact console message banner */}
      <h2 className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-white mb-2">
        {isTooLow ? 'TOO LOW GUESSING NUMBER, TRY AGAIN!!' : 'TOO HIGH GUESSING NUMBER, TRY AGAIN!!'}
      </h2>

      <p className="text-xs sm:text-sm text-slate-300 font-sans mb-3">
        Your guess of <span className="font-bold font-mono text-white text-base px-2 py-0.5 rounded bg-slate-800">{guess}</span> was{' '}
        <span className="font-bold">{isTooLow ? 'lower' : 'higher'}</span> than the target.
      </p>

      {/* Temperature Proximity Indicator */}
      <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-full text-xs font-mono">
        {proximityPercent > 60 ? <Flame className="w-4 h-4 text-amber-400" /> : <Snowflake className="w-4 h-4 text-cyan-400" />}
        <span className="text-slate-400">Proximity:</span>
        <span className={`font-bold ${proxInfo.color}`}>{proxInfo.label}</span>
      </div>
    </div>
  );
};
