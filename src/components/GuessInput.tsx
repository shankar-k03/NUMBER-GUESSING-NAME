import React, { useState, useEffect, useRef } from 'react';
import { Send, Keyboard, Sparkles, AlertCircle, Plus, Minus } from 'lucide-react';
import { sound } from '../utils/sound';

interface GuessInputProps {
  onGuessSubmit: (num: number) => void;
  disabled: boolean;
  minPossible: number;
  maxPossible: number;
  minLimit: number;
  maxLimit: number;
}

export const GuessInput: React.FC<GuessInputProps> = ({
  onGuessSubmit,
  disabled,
  minPossible,
  maxPossible,
  minLimit,
  maxLimit,
}) => {
  const [value, setValue] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showKeypad, setShowKeypad] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount or when enabled
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (disabled) return;

    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      setErrorMsg('Please enter a valid number!');
      sound.playTooLow();
      return;
    }

    if (parsed < minLimit || parsed > maxLimit) {
      setErrorMsg(`Please guess a number between ${minLimit} and ${maxLimit}!`);
      sound.playTooLow();
      return;
    }

    setErrorMsg(null);
    onGuessSubmit(parsed);
    setValue('');
  };

  const adjustValue = (delta: number) => {
    if (disabled) return;
    sound.playClick();
    const current = parseInt(value, 10) || Math.round((minPossible + maxPossible) / 2);
    const next = Math.max(minLimit, Math.min(maxLimit, current + delta));
    setValue(next.toString());
  };

  const handleSuggestMidpoint = () => {
    if (disabled) return;
    sound.playClick();
    const mid = Math.floor((minPossible + maxPossible) / 2);
    setValue(mid.toString());
  };

  const handleKeypadPress = (num: string) => {
    if (disabled) return;
    sound.playClick();
    if (num === 'CLEAR') {
      setValue('');
    } else if (num === 'DEL') {
      setValue((prev) => prev.slice(0, -1));
    } else {
      setValue((prev) => (prev.length < 5 ? prev + num : prev));
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Label & Binary Search Smart Tip */}
        <div className="flex items-center justify-between">
          <label htmlFor="guess-input-field" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span>Enter Your Guess</span>
            <span className="text-xs font-normal text-slate-400 font-mono">({minLimit} - {maxLimit})</span>
          </label>

          <button
            type="button"
            id="suggest-midpoint-btn"
            onClick={handleSuggestMidpoint}
            disabled={disabled}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Calculate mathematical midpoint for binary search algorithm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Optimal Hint ({Math.floor((minPossible + maxPossible) / 2)})</span>
          </button>
        </div>

        {/* Input box + Big Submit button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              id="guess-input-field"
              type="number"
              min={minLimit}
              max={maxLimit}
              disabled={disabled}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder={`Type a number (${minPossible}-${maxPossible})...`}
              className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 text-white font-mono text-2xl font-bold py-3 px-4 rounded-xl outline-none transition-all placeholder:text-slate-600 placeholder:text-sm placeholder:font-sans disabled:opacity-50"
            />
            
            {/* Clear X button inside input */}
            {value && !disabled && (
              <button
                type="button"
                id="clear-input-btn"
                onClick={() => setValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-mono bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md"
              >
                CLEAR
              </button>
            )}
          </div>

          <button
            type="submit"
            id="submit-guess-btn"
            disabled={disabled || !value.trim()}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-base py-3 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
          >
            <span>SUBMIT GUESS</span>
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Error / Validation Warning */}
        {errorMsg && (
          <div className="flex items-center gap-2 text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Stepper Buttons (+1, -1, +10, -10) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-medium mr-1">Quick Nudges:</span>
            {[-10, -5, -1, 1, 5, 10].map((step) => (
              <button
                key={step}
                type="button"
                id={`step-btn-${step > 0 ? `plus-${step}` : `minus-${Math.abs(step)}`}`}
                onClick={() => adjustValue(step)}
                disabled={disabled}
                className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/60 text-slate-200 hover:text-white transition-all disabled:opacity-50 flex items-center gap-0.5"
              >
                {step > 0 ? <Plus className="w-3 h-3 text-emerald-400" /> : <Minus className="w-3 h-3 text-rose-400" />}
                {Math.abs(step)}
              </button>
            ))}
          </div>

          {/* Keypad Toggle Button */}
          <button
            type="button"
            id="toggle-keypad-btn"
            onClick={() => {
              sound.playClick();
              setShowKeypad(!showKeypad);
            }}
            className="text-xs font-medium text-slate-400 hover:text-amber-400 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-all"
          >
            <Keyboard className="w-4 h-4" />
            <span>{showKeypad ? 'Hide Keypad' : 'On-Screen Keypad'}</span>
          </button>
        </div>

        {/* Optional Onscreen NumPad */}
        {showKeypad && (
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 max-w-xs mx-auto w-full">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'DEL', '0', 'CLEAR'].map((key) => (
              <button
                key={key}
                type="button"
                id={`numpad-key-${key}`}
                disabled={disabled}
                onClick={() => handleKeypadPress(key)}
                className={`py-2.5 rounded-xl text-base font-mono font-bold transition-all ${
                  key === 'DEL' || key === 'CLEAR'
                    ? 'bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs'
                    : 'bg-slate-950 hover:bg-slate-800 text-white border border-slate-800'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        )}

      </form>
    </div>
  );
};
