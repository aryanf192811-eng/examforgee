import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface VirtualCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VirtualCalculator({ isOpen, onClose }: VirtualCalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const append = (char: string) => {
    setDisplay(prev => (prev === '0' ? char : prev + char));
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const calculate = () => {
    try {
      // Basic math evaluator (safer than eval)
      // For a real production app, use math.js
      const result = Function('"use strict";return (' + display + ')')();
      setEquation(display + ' =');
      setDisplay(String(result));
    } catch {
      setDisplay('Error');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div 
          className="bg-surface-container-high rounded-3xl shadow-2xl w-full max-w-[320px] overflow-hidden border border-outline-variant"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-outline-variant">
            <h3 className="text-label-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">calculate</span>
              Scientific Calculator
            </h3>
            <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
              close
            </button>
          </div>

          {/* Display */}
          <div className="p-6 bg-surface-container text-right space-y-1">
            <div className="text-label-sm text-outline h-4 overflow-hidden truncate">
              {equation}
            </div>
            <div className="text-headline-md font-mono text-on-surface overflow-hidden truncate">
              {display}
            </div>
          </div>

          {/* Keypad */}
          <div className="p-4 grid grid-cols-4 gap-2">
            {['C', '(', ')', '/'].map(k => (
              <button key={k} onClick={k === 'C' ? clear : () => append(k)} className="h-12 rounded-xl bg-surface-container-highest text-on-surface-variant font-bold hover:bg-surface-container-low transition-colors cursor-pointer">
                {k}
              </button>
            ))}
            {['7', '8', '9', '*'].map(k => (
              <button key={k} onClick={() => append(k)} className="h-12 rounded-xl bg-surface-container text-on-surface text-title-md hover:bg-surface-container-high transition-colors cursor-pointer">
                {k}
              </button>
            ))}
            {['4', '5', '6', '-'].map(k => (
              <button key={k} onClick={() => append(k)} className="h-12 rounded-xl bg-surface-container text-on-surface text-title-md hover:bg-surface-container-high transition-colors cursor-pointer">
                {k}
              </button>
            ))}
            {['1', '2', '3', '+'].map(k => (
              <button key={k} onClick={() => append(k)} className="h-12 rounded-xl bg-surface-container text-on-surface text-title-md hover:bg-surface-container-high transition-colors cursor-pointer">
                {k}
              </button>
            ))}
            {['0', '.', '=', '%'].map(k => (
              <button 
                key={k} 
                onClick={k === '=' ? calculate : () => append(k)} 
                className={cn(
                  "h-12 rounded-xl font-bold transition-colors cursor-pointer",
                  k === '=' ? "bg-primary text-on-primary hover:bg-primary-dark" : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                )}
              >
                {k}
              </button>
            ))}
          </div>
          
          <div className="px-4 pb-4">
             <p className="text-[10px] text-center text-outline uppercase tracking-widest font-bold">
               Standard GATE Scientific Interface
             </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
