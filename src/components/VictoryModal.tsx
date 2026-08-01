import React from 'react';
import { Trophy, RotateCcw, Share2, Check, Star, Zap } from 'lucide-react';
import { sound } from '../utils/sound';

interface VictoryModalProps {
  isOpen: boolean;
  targetNumber: number;
  attemptsCount: number;
  difficultyName: string;
  onPlayAgain: () => void;
  isNewBest: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  targetNumber,
  attemptsCount,
  difficultyName,
  onPlayAgain,
  isNewBest,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  // Rating based on attempt efficiency
  const getRating = (count: number) => {
    if (count <= 4) return { title: 'GENIUS / LUCKY!', stars: 5, desc: 'Flawless deduction or incredible intuition!' };
    if (count <= 7) return { title: 'BINARY SEARCH MASTER!', stars: 4, desc: 'Optimal strategy used!' };
    if (count <= 10) return { title: 'GREAT DETECTIVE!', stars: 3, desc: 'Solid analytical effort!' };
    return { title: 'VICTORIOUS PERSISTENCE!', stars: 2, desc: 'You never gave up!' };
  };

  const rating = getRating(attemptsCount);

  const handleShare = () => {
    const text = `🎉 I guessed the secret number ${targetNumber} in ${attemptsCount} ${
      attemptsCount === 1 ? 'try' : 'tries'
    } on Number Guessing Game (${difficultyName} mode)! 🎯`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-400/60 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden text-center p-6 sm:p-8 relative">
        
        {/* Glow backdrop */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Icon Trophy */}
        <div className="inline-flex p-4 rounded-3xl bg-amber-400/10 text-amber-400 border-2 border-amber-400/30 mb-4 shadow-lg shadow-amber-400/10 animate-bounce">
          <Trophy className="w-12 h-12" />
        </div>

        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight mb-1">
          YOU WON!
        </h2>
        <p className="text-xs text-amber-300 font-medium uppercase tracking-wider mb-6">
          {difficultyName} Difficulty
        </p>

        {/* Secret number banner */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-6">
          <div className="text-xs text-slate-400 uppercase font-mono mb-1">Secret Number Was</div>
          <div className="text-4xl font-black text-amber-400 font-mono tracking-widest">{targetNumber}</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[11px] text-slate-400 block font-sans">Total Guesses</span>
            <span className="text-xl font-bold font-mono text-white">{attemptsCount}</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[11px] text-slate-400 block font-sans">Performance</span>
            <div className="flex items-center gap-1 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < rating.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* New Best Badge */}
        {isNewBest && (
          <div className="mb-6 p-2.5 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono flex items-center justify-center gap-1.5 animate-pulse">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>NEW PERSONAL BEST SCORE!</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copied Result!' : 'Share Score'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
