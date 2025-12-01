import { cn } from "@/lib/utils";
import { FileText, LayoutDashboard, Plus, Layers, LogOut } from 'lucide-react';
import { NavItem } from './NavItem';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';

interface Props {
  isSidebarOpen: boolean;
  onClose?: () => void;
}

function SidebarContent({ isOpen }: { isOpen: boolean }) {
  return (
    <>
      <div className="p-4 flex items-center gap-3 border-b h-16">
        <div className="w-8 h-8 bg-[#082f49] rounded-md flex items-center justify-center text-white shrink-0">
           <FileText className="h-5 w-5" />
        </div>
        {isOpen && <span className="font-bold text-xl text-[#082f49]">প্রশ্নব্যাংক</span>}
      </div>
      <nav className="p-4 space-y-2 flex-1">
        <NavItem icon={<LayoutDashboard />} label="ড্যাশবোর্ড" isActive isOpen={isOpen} />
        <NavItem icon={<Plus />} label="১ ক্লিকে প্রশ্ন তৈরি" isOpen={isOpen} />
        <NavItem icon={<Layers />} label="প্রশ্নভান্ডার" isOpen={isOpen} />
      </nav>
      <div className="p-4 border-t">
        <NavItem icon={<LogOut />} label="লগআউট" className="text-red-500" isOpen={isOpen} />
      </div>
    </>
  );
}

export function DashboardSidebar({ isSidebarOpen, onClose }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Use setTimeout to defer state update
    const timeoutId = setTimeout(() => {
      checkMobile();
    }, 0);
    
    window.addEventListener('resize', checkMobile);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <>
      {/* Desktop Sidebar - Always render with consistent initial state */}
      <aside 
        className={cn(
          "bg-white border-r flex flex-col transition-[width] duration-300",
          "hidden md:flex"
        )}
        style={{ width: isSidebarOpen ? '16rem' : '5rem' }}
        suppressHydrationWarning
      >
        <SidebarContent isOpen={isSidebarOpen} />
      </aside>

      {/* Mobile Sidebar Sheet */}
      {isMobile && (
        <Sheet open={isSidebarOpen} onOpenChange={onClose}>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader>
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full">
              <SidebarContent isOpen={true} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
