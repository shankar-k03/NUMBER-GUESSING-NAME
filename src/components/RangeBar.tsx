import React from 'react';
import { ArrowLeftRight, HelpCircle } from 'lucide-react';

interface RangeBarProps {
  minLimit: number;
  maxLimit: number;
  possibleMin: number;
  possibleMax: number;
  lastGuess: number | null;
}

export const RangeBar: React.FC<RangeBarProps> = ({
  minLimit,
  maxLimit,
  possibleMin,
  possibleMax,
  lastGuess,
}) => {
  const totalRange = maxLimit - minLimit || 1;
  const leftPercent = Math.max(0, Math.min(100, ((possibleMin - minLimit) / totalRange) * 100));
  const rightPercent = Math.max(0, Math.min(100, ((maxLimit - possibleMax) / totalRange) * 100));
  
  const lastGuessPercent = lastGuess !== null 
    ? Math.max(0, Math.min(100, ((lastGuess - minLimit) / totalRange) * 100))
    : null;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-slate-300 font-medium text-xs sm:text-sm">
          <ArrowLeftRight className="w-4 h-4 text-amber-400" />
          <span>Active Target Range</span>
        </div>
        <div className="text-xs font-mono font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
          Between {possibleMin} and {possibleMax}
        </div>
      </div>

      {/* Visual Range Bar */}
      <div className="relative w-full h-7 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 my-3 flex items-center">
        {/* Out of bounds left */}
        <div 
          className="h-full bg-slate-900/80 transition-all duration-300 relative border-r border-slate-800"
          style={{ width: `${leftPercent}%` }}
        />

        {/* Valid target range window */}
        <div 
          className="h-full bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-emerald-500/20 border-x-2 border-amber-400/60 transition-all duration-300 relative flex items-center justify-center"
          style={{ width: `${100 - leftPercent - rightPercent}%` }}
        >
          <div className="absolute inset-0 bg-amber-400/5 animate-pulse" />
          <span className="text-[10px] font-mono text-amber-300 font-bold z-10 hidden sm:inline">
            Secret Number Inside
          </span>
        </div>

        {/* Out of bounds right */}
        <div 
          className="h-full bg-slate-900/80 transition-all duration-300 relative border-l border-slate-800"
          style={{ width: `${rightPercent}%` }}
        />

        {/* Last guess indicator mark */}
        {lastGuessPercent !== null && (
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_#fff] z-20 transition-all duration-300"
            style={{ left: `${lastGuessPercent}%` }}
          >
            <div className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-white rounded-full border-2 border-slate-950 shadow-md" />
          </div>
        )}
      </div>

      {/* Boundary labels */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex flex-col items-start">
          <span className="text-[10px] text-slate-500 uppercase font-sans">Min Limit</span>
          <span className="text-slate-200 font-bold">{minLimit}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 italic">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>Guesses narrow down this window!</span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-500 uppercase font-sans">Max Limit</span>
          <span className="text-slate-200 font-bold">{maxLimit}</span>
        </div>
      </div>
    </div>
  );
};
