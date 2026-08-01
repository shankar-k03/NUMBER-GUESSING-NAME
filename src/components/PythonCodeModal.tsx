import React from 'react';
import { X, Code2, ArrowRight, Check, Copy } from 'lucide-react';
import { sound } from '../utils/sound';

interface PythonCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonCodeModal: React.FC<PythonCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const pythonCode = `import random

S_NUM = random.randint(1, 100)
while True:
     user_num = int(input("ENTER GUESSING NUMBER : "))
     if(S_NUM == user_num):
        print("CONGRATULATION YOUR GUESSING IS RIGHT")
        break
     elif(S_NUM > user_num):
      print("TOO LOW GUESSING NUMBER, TRY AGAIN!!")
     elif(S_NUM < user_num):
      print("TOO HIGH GUESSING NUMBER, TRY AGAIN!!")
     else:
        print("INCORRECT GUESSING TRY AGAIN")`;

  const copyCode = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Original Python Code vs. Web App Architecture</h2>
              <p className="text-xs text-slate-400">How Python console logic transforms into an interactive React web app</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm custom-scrollbar">
          
          {/* Python snippet box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                🐍 Python Script Provided
              </span>
              <button
                onClick={copyCode}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-400 font-mono text-xs leading-relaxed overflow-x-auto">
              <code>{pythonCode}</code>
            </pre>
          </div>

          {/* Transformation comparison breakdown */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
              Key Concepts Mapping Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="font-mono text-amber-400 font-bold mb-1">1. Random Number Generation</div>
                <div className="text-slate-400 text-xs space-y-1">
                  <p><strong className="text-slate-200">Python:</strong> <code className="text-emerald-400 font-mono">random.randint(1, 100)</code></p>
                  <p className="flex items-center gap-1 text-slate-300"><ArrowRight className="w-3 h-3 text-amber-400" /> <strong className="text-slate-200">Web App:</strong> <code className="text-indigo-300 font-mono">Math.floor(Math.random() * max) + 1</code> stored in React state.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="font-mono text-amber-400 font-bold mb-1">2. Game Loop</div>
                <div className="text-slate-400 text-xs space-y-1">
                  <p><strong className="text-slate-200">Python:</strong> Blocking <code className="text-emerald-400 font-mono">while True:</code> loop</p>
                  <p className="flex items-center gap-1 text-slate-300"><ArrowRight className="w-3 h-3 text-amber-400" /> <strong className="text-slate-200">Web App:</strong> Non-blocking event-driven React handlers (<code className="text-indigo-300 font-mono">onSubmit</code>).</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="font-mono text-amber-400 font-bold mb-1">3. User Input</div>
                <div className="text-slate-400 text-xs space-y-1">
                  <p><strong className="text-slate-200">Python:</strong> Console <code className="text-emerald-400 font-mono">int(input(...))</code></p>
                  <p className="flex items-center gap-1 text-slate-300"><ArrowRight className="w-3 h-3 text-amber-400" /> <strong className="text-slate-200">Web App:</strong> Interactive HTML form, stepper buttons, & onscreen keypad.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="font-mono text-amber-400 font-bold mb-1">4. Feedback & UI</div>
                <div className="text-slate-400 text-xs space-y-1">
                  <p><strong className="text-slate-200">Python:</strong> Console <code className="text-emerald-400 font-mono">print(...)</code> messages</p>
                  <p className="flex items-center gap-1 text-slate-300"><ArrowRight className="w-3 h-3 text-amber-400" /> <strong className="text-slate-200">Web App:</strong> Color-coded banners, audio chimes, proximity gauge & confetti!</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
          >
            Got it, Let's Play!
          </button>
        </div>

      </div>
    </div>
  );
};
