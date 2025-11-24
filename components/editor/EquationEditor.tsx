import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { X } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

interface EquationEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (latex: string) => void;
}

const mathSymbols = [
  { label: '÷', latex: '\\div' },
  { label: '·', latex: '\\cdot' },
  { label: '×', latex: '\\times' },
  { label: '∀', latex: '\\forall' },
  { label: '⊂', latex: '\\subset' },
  { label: '⊃', latex: '\\supset' },
  
  { label: '∅', latex: '\\emptyset' },
  { label: '∈', latex: '\\in' },
  { label: '∉', latex: '\\notin' },
  { label: '∪', latex: '\\cup' },
  { label: 'θ', latex: '\\theta' },
  { label: 'η', latex: '\\eta' },
  
  { label: 'π', latex: '\\pi' },
  { label: 'ρ', latex: '\\rho' },
  { label: 'σ', latex: '\\sigma' },
  { label: 'λ', latex: '\\lambda' },
  { label: '∞', latex: '\\infty' },
  { label: 'ω', latex: '\\omega' },
  
  { label: 'Ω', latex: '\\Omega' },
  { label: '×', latex: '\\times' },
  { label: '←', latex: '\\leftarrow' },
  { label: '→', latex: '\\rightarrow' },
  { label: '⇔', latex: '\\Leftrightarrow' },
  { label: '⇒', latex: '\\Rightarrow' },
  
  { label: '±/∓', latex: '\\pm/\\mp' },
  { label: '√', latex: '\\sqrt{}' },
  { label: '±', latex: '\\pm' },
  { label: '≥', latex: '\\geq' },
  { label: '≤', latex: '\\leq' },
  { label: '≈', latex: '\\approx' },
  
  { label: '=', latex: '=' },
  { label: '≠', latex: '\\neq' },
  { label: '|x|', latex: '|x|' },
  { label: 'x⃗', latex: '\\vec{x}' },
  { label: 'x̄', latex: '\\overline{x}' },
  { label: 'lim', latex: '\\lim_{x\\to b}' },
  
  { label: '∫', latex: '\\int' },
  { label: '∫ₐᵇ', latex: '\\int_a^b' },
  { label: '(ⁿₖ)', latex: '\\binom{n}{k}' },
  { label: 'xₐ', latex: 'x_a' },
  { label: 'xᵃ', latex: 'x^a' },
  { label: 'xₐᵇ', latex: 'x_a^b' },
];

export const EquationEditor = ({ open, onOpenChange, onInsert }: EquationEditorProps) => {
  const [equation, setEquation] = useState('\\frac{1}{\\sqrt{2}} \\cdot 2');

  const handleSymbolClick = (latex: string) => {
    setEquation(prev => prev + ' ' + latex);
  };

  const handleSave = () => {
    onInsert(equation);
    onOpenChange(false);
    setEquation('');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" data-equation-editor className="w-full sm:max-w-lg overflow-y-auto pt-10 z-[9999]">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Equation editor</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Preview Area */}
          <div className="border rounded-lg p-6 min-h-[120px] bg-background flex items-center justify-center">
            {equation ? (
              <BlockMath math={equation} />
            ) : (
              <span className="text-muted-foreground">Preview will appear here</span>
            )}
          </div>

          {/* LaTeX Input */}
          <div>
            <textarea
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              className="w-full min-h-[80px] p-3 border rounded-lg font-mono text-sm resize-none"
              placeholder="Enter LaTeX equation..."
            />
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full bg-[#009d6e] hover:bg-[#008a60]" size="lg">
            Save
          </Button>

          {/* Math Symbols Grid */}
          <div className="grid grid-cols-6 gap-2">
            {mathSymbols.map((symbol, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-14 text-lg font-serif hover:bg-accent"
                onClick={() => handleSymbolClick(symbol.latex)}
                title={symbol.latex}
              >
                {symbol.label}
              </Button>
            ))}
          </div>

          {/* Common Templates */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Common Templates</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => setEquation('\\frac{a}{b}')}
                className="h-12 text-sm"
              >
                Fraction
              </Button>
              <Button
                variant="outline"
                onClick={() => setEquation('\\sqrt{x}')}
                className="h-12 text-sm"
              >
                Square Root
              </Button>
              <Button
                variant="outline"
                onClick={() => setEquation('x^{n}')}
                className="h-12 text-sm"
              >
                Power
              </Button>
              <Button
                variant="outline"
                onClick={() => setEquation('\\sum_{i=1}^{n}')}
                className="h-12 text-sm"
              >
                Summation
              </Button>
              <Button
                variant="outline"
                onClick={() => setEquation('\\int_{a}^{b}')}
                className="h-12 text-sm"
              >
                Integral
              </Button>
              <Button
                variant="outline"
                onClick={() => setEquation('\\lim_{x \\to \\infty}')}
                className="h-12 text-sm"
              >
                Limit
              </Button>
            </div>
          </div>

          {/* Clear Button */}
          <Button
            variant="outline"
            onClick={() => setEquation('')}
            className="w-full"
          >
            Clear
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};