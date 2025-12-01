import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu } from 'lucide-react';
import { UserMenu } from '@/components/auth';

interface Props {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function DashboardHeader({ isSidebarOpen, setSidebarOpen }: Props) {
  return (
    <header className="h-16 bg-white border-b px-4 sm:px-6 flex items-center justify-between">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="md:flex"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-4">
         <div className="relative hidden sm:block">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
           <Input className="pl-9 w-40 sm:w-64 bg-gray-50 border-gray-200" placeholder="খুঁজুন..." />
         </div>
        <UserMenu />
      </div>
    </header>
  );
}
