import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { BOARDS_LIST } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedBoards: string[];
  onBoardsChange: (boards: string[]) => void;
}

export function BoardSelectModal({ isOpen, onClose, selectedBoards, onBoardsChange }: Props) {
  const handleToggle = (board: string) => {
    if (selectedBoards.includes(board)) {
      onBoardsChange(selectedBoards.filter(b => b !== board));
    } else {
      onBoardsChange([...selectedBoards, board]);
    }
  };

  const handleSelectAll = () => {
    onBoardsChange(BOARDS_LIST);
  };

  const handleClearAll = () => {
    onBoardsChange([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>বোর্ড নির্বাচন করুন</DialogTitle>
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
            {BOARDS_LIST.map(board => (
              <div key={board} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                <Checkbox 
                  id={`modal-board-${board}`}
                  checked={selectedBoards.includes(board)}
                  onCheckedChange={() => handleToggle(board)}
                />
                <label 
                  htmlFor={`modal-board-${board}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {board} বোর্ড
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              বাতিল
            </Button>
            <Button onClick={onClose} className="bg-[#009d6e] hover:bg-[#008a60]">
              প্রয়োগ করুন ({selectedBoards.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
