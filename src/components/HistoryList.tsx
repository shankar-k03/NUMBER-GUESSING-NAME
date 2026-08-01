import React from 'react';
import { History, ArrowUp, ArrowDown, CheckCircle2 } from 'lucide-react';
import { GuessRecord } from '../types';

interface HistoryListProps {
  history: GuessRecord[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <History className="w-4 h-4 text-amber-400" />
          <span>Guess History ({history.length} {history.length === 1 ? 'attempt' : 'attempts'})</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">Latest first</span>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
        {[...history].reverse().map((rec) => {
          const isCorrect = rec.result === 'CORRECT';
          const isTooLow = rec.result === 'TOO_LOW';

          return (
            <div
              key={`${rec.attemptNumber}-${rec.timestamp}`}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : isTooLow
                  ? 'bg-blue-950/20 border-blue-800/40 text-blue-200'
                  : 'bg-purple-950/20 border-purple-800/40 text-purple-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-[11px]">
                  #{rec.attemptNumber}
                </span>

                <span className="text-base font-bold text-white px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                  {rec.guess}
                </span>

                <div className="flex items-center gap-1 font-semibold">
                  {isCorrect ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct!
                    </span>
                  ) : isTooLow ? (
                    <span className="text-blue-400 flex items-center gap-1">
                      <ArrowUp className="w-3.5 h-3.5" /> Too Low
                    </span>
                  ) : (
                    <span className="text-purple-400 flex items-center gap-1">
                      <ArrowDown className="w-3.5 h-3.5" /> Too High
                    </span>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-sans hidden sm:block">
                Range narrowed to: <span className="text-amber-400 font-mono">{rec.possibleMin} - {rec.possibleMax}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
