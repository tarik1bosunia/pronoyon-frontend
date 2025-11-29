import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { SCHOOLS_LIST } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedSchools: string[];
  onSchoolsChange: (schools: string[]) => void;
}

export function SchoolSelectModal({ isOpen, onClose, selectedSchools, onSchoolsChange }: Props) {
  const handleToggle = (school: string) => {
    if (selectedSchools.includes(school)) {
      onSchoolsChange(selectedSchools.filter(s => s !== school));
    } else {
      onSchoolsChange([...selectedSchools, school]);
    }
  };

  const handleSelectAll = () => {
    onSchoolsChange(SCHOOLS_LIST);
  };

  const handleClearAll = () => {
    onSchoolsChange([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>স্কুল/কলেজ নির্বাচন করুন</DialogTitle>
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

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {SCHOOLS_LIST.map(school => (
              <div key={school} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                <Checkbox 
                  id={`modal-school-${school}`}
                  checked={selectedSchools.includes(school)}
                  onCheckedChange={() => handleToggle(school)}
                />
                <label 
                  htmlFor={`modal-school-${school}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {school}
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              বাতিল
            </Button>
            <Button onClick={onClose} className="bg-[#009d6e] hover:bg-[#008a60]">
              প্রয়োগ করুন ({selectedSchools.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
