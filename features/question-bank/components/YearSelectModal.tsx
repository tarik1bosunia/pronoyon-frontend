import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const YEARS = ['২০২৩', '২০২২', '২০২১', '২০২০', '২০১৯', '২০১৮'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedYears: string[];
  onYearsChange: (years: string[]) => void;
}

export function YearSelectModal({ isOpen, onClose, selectedYears, onYearsChange }: Props) {
  const handleToggle = (year: string) => {
    if (selectedYears.includes(year)) {
      onYearsChange(selectedYears.filter(y => y !== year));
    } else {
      onYearsChange([...selectedYears, year]);
    }
  };

  const handleSelectAll = () => {
    onYearsChange(YEARS);
  };

  const handleClearAll = () => {
    onYearsChange([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>বছর নির্বাচন করুন</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll} className="flex-1">
              সব নির্বাচন
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearAll} className="flex-1">
              মুছে ফেলুন
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {YEARS.map(year => (
              <div key={year} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                <Checkbox 
                  id={`modal-year-${year}`}
                  checked={selectedYears.includes(year)}
                  onCheckedChange={() => handleToggle(year)}
                />
                <label 
                  htmlFor={`modal-year-${year}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {year}
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              বাতিল
            </Button>
            <Button onClick={onClose} className="bg-[#009d6e] hover:bg-[#008a60]">
              প্রয়োগ করুন ({selectedYears.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
