/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Precision Calculator Engine & Tactile Keypad
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Delete, 
  RotateCcw, 
  History, 
  Divide, 
  X as Multiply, 
  Minus, 
  Plus, 
  Equal, 
  Percent 
} from 'lucide-react';

interface CalculationRecord {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export const CalculatorTool: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<'+' | '-' | '×' | '÷' | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Controlled Arithmetic Engine without using eval()
  const calculate = (a: number, b: number, op: '+' | '-' | '×' | '÷'): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b === 0 ? NaN : a / b;
    }
  };

  const handleDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const handleDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const handleOperator = useCallback((nextOp: '+' | '-' | '×' | '÷') => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator && !waitingForOperand) {
      const result = calculate(prevValue, inputValue, operator);
      const formatted = isNaN(result) ? 'Error' : parseFloat(result.toFixed(8)).toString();
      setDisplay(formatted);
      setPrevValue(result);

      // Record to history
      setHistory((prev) => [
        {
          id: Math.random().toString(),
          expression: `${prevValue} ${operator} ${inputValue}`,
          result: formatted,
          timestamp: Date.now(),
        },
        ...prev.slice(0, 19),
      ]);
    }

    setWaitingForOperand(true);
    setOperator(nextOp);
  }, [display, prevValue, operator, waitingForOperand]);

  const handleEquals = useCallback(() => {
    const inputValue = parseFloat(display);

    if (operator && prevValue !== null) {
      const result = calculate(prevValue, inputValue, operator);
      const formatted = isNaN(result) ? 'Error' : parseFloat(result.toFixed(8)).toString();
      
      setHistory((prev) => [
        {
          id: Math.random().toString(),
          expression: `${prevValue} ${operator} ${inputValue}`,
          result: formatted,
          timestamp: Date.now(),
        },
        ...prev.slice(0, 19),
      ]);

      setDisplay(formatted);
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  }, [display, operator, prevValue]);

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    if (waitingForOperand) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handlePercentage = () => {
    const current = parseFloat(display);
    if (!isNaN(current)) {
      setDisplay((current / 100).toString());
    }
  };

  const handleToggleSign = () => {
    const current = parseFloat(display);
    if (!isNaN(current) && current !== 0) {
      setDisplay((-current).toString());
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        handleDigit(e.key);
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('-');
      } else if (e.key === '*') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDigit, handleDecimal, handleOperator, handleEquals]);

  return (
    <div className="w-full max-w-sm mx-auto p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold px-1">
        <span>FR SHAH QuickPanel · Calculator</span>
        <div className="flex items-center gap-2">
          {memory !== 0 && (
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 font-mono">
              M: {memory}
            </span>
          )}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-1.5 rounded-lg transition-colors ${
              showHistory ? 'text-zinc-100 bg-zinc-800' : 'hover:text-zinc-200'
            }`}
            title="Calculation History"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calculator Display Screen */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-right font-mono select-all">
        <div className="text-xs text-zinc-500 h-5 truncate">
          {prevValue !== null && operator ? `${prevValue} ${operator}` : ''}
        </div>
        <div className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 overflow-x-auto whitespace-nowrap">
          {display}
        </div>
      </div>

      {/* History Drawer if toggled */}
      {showHistory ? (
        <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 max-h-64 overflow-y-auto space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 border-b border-zinc-800 pb-1">
            <span>Recent Calculations</span>
            <button
              onClick={() => setHistory([])}
              className="text-zinc-400 hover:text-rose-400"
            >
              Clear
            </button>
          </div>
          {history.length === 0 ? (
            <div className="py-6 text-center text-zinc-600">No calculations recorded</div>
          ) : (
            history.map((h) => (
              <div
                key={h.id}
                onClick={() => {
                  setDisplay(h.result);
                  setShowHistory(false);
                }}
                className="p-2 rounded-xl hover:bg-zinc-900 cursor-pointer transition-colors flex items-center justify-between"
              >
                <span className="text-zinc-400">{h.expression} =</span>
                <span className="text-zinc-100 font-bold">{h.result}</span>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Tactile Keypad (Black & Grey Aesthetic) */
        <div className="grid grid-cols-4 gap-2 text-sm font-semibold select-none">
          {/* Row 1 */}
          <button
            onClick={handleClear}
            className="h-12 rounded-2xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 transition-all font-bold"
          >
            AC
          </button>
          <button
            onClick={handleToggleSign}
            className="h-12 rounded-2xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 transition-all"
          >
            ±
          </button>
          <button
            onClick={handlePercentage}
            className="h-12 rounded-2xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 transition-all"
          >
            %
          </button>
          <button
            onClick={() => handleOperator('÷')}
            className={`h-12 rounded-2xl transition-all flex items-center justify-center ${
              operator === '÷'
                ? 'bg-zinc-200 text-zinc-900'
                : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100'
            }`}
          >
            <Divide className="w-4 h-4" />
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleDigit('7')}
            className="h-12 rounded-2xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 active:scale-95 transition-all text-base"
          >
            7
          </button>
          <button
            onClick={() => handleDigit('8')}
            className="h-12 rounded-2xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 active:scale-95 transition-all text-base"
          >
            8
          </button>
          <button
            onClick={() => handleDigit('9')}
            className="h-12 rounded-2xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 active:scale-95 transition-all text-base"
          >
            9
          </button>
          <button
            onClick={() => handleOperator('×')}
            className={`h-12 rounded-2xl transition-all flex items-center justify-center ${
              operator === '×'
                ? 'bg-zinc-200 text-zinc-900'
                : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100'
            }`}
          >
            <Multiply className="w-4 h-4" />
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleDigit('4')}
            className="h-12 rounded-2xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 active:scale-95 transition-all text-base"
          >
            4
          </button>
          <button
            onClick={() => handleDigit('5')}
            className="h-12 rounded-2xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 active:scale-95 transition-all text-base"
          >
            5
          </button>
          <button
            onClick={() => handleDigit('6')}
            className="h-12 rounded-2xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 active:scale-95 transition-all text-base"
          >
            6
          </button>
          <button
            onClick={() => handleOperator('-')}
            className={`h-12 rounded-2xl transition-all flex items-center justify-center ${
              operator === '-'
                ? 'bg-zinc-200 text-zinc-900'
                : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100'
            }`}
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Row 4 */}
          <button
            onClick={() => handleDigit('1')}
            className="h-12 rounded-2xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 active:scale-95 transition-all text-base"
          >
            1
          </button>
          <button
            onClick={() => handleDigit('2')}
            className="h-12 rounded-2xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 active:scale-95 transition-all text-base"
          >
            2
          </button>
          <button
            onClick={() => handleDigit('3')}
            className="h-12 rounded-2xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 active:scale-95 transition-all text-base"
          >
            3
          </button>
          <button
            onClick={() => handleOperator('+')}
            className={`h-12 rounded-2xl transition-all flex items-center justify-center ${
              operator === '+'
                ? 'bg-zinc-200 text-zinc-900'
                : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Row 5 */}
          <button
            onClick={handleBackspace}
            className="h-12 rounded-2xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 transition-all flex items-center justify-center"
            title="Backspace"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-12 rounded-2xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 active:scale-95 transition-all text-base"
          >
            0
          </button>
          <button
            onClick={handleDecimal}
            className="h-12 rounded-2xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 active:scale-95 transition-all text-base"
          >
            .
          </button>
          <button
            onClick={handleEquals}
            className="h-12 rounded-2xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold active:scale-95 transition-all flex items-center justify-center shadow-sm"
          >
            <Equal className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      )}
    </div>
  );
};
