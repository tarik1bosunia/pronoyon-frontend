import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: string[];
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
}

export function MultiSelectModal({ 
  open, 
  onOpenChange, 
  title, 
  items, 
  selectedItems, 
  onSelectionChange 
}: Props) {
  const [tempSelection, setTempSelection] = useState<string[]>(selectedItems);

  useEffect(() => {
    if (open) {
      setTempSelection(selectedItems);
    }
  }, [open, selectedItems]);

  const toggleItem = (item: string) => {
    setTempSelection(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
    );
  };

  const handleConfirm = () => {
    onSelectionChange(tempSelection);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-xl">
        <DialogHeader className="p-4 border-b bg-gray-50/50 flex flex-row items-center justify-between">
          <DialogTitle className="text-gray-700 font-bold text-lg">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="p-2 max-h-[400px] overflow-y-auto">
          {items.map((item) => {
            const isSelected = tempSelection.includes(item);
            return (
              <div 
                key={item}
                onClick={() => toggleItem(item)}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all select-none mx-1 my-1",
                  isSelected ? "bg-green-50 border border-green-100" : "hover:bg-gray-50 border border-transparent"
                )}
              >
                <div className={cn(
                  "h-5 w-5 rounded border flex items-center justify-center transition-colors",
                  isSelected ? "bg-[#009d6e] border-[#009d6e]" : "border-gray-300 bg-white"
                )}>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                </div>
                <span className={cn(
                  "text-sm font-medium flex-1",
                  isSelected ? "text-[#009d6e]" : "text-gray-700"
                )}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 border-t divide-x">
          <button 
            onClick={handleConfirm}
            className="p-3 text-sm font-semibold text-white bg-[#009d6e] hover:bg-[#008a60] transition-colors"
          >
            সিলেক্ট করুন ({tempSelection.length})
          </button>
          <button 
            onClick={() => onOpenChange(false)}
            className="p-3 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
