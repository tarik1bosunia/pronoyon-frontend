"use client"

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  sidebarContent: ReactNode;
  mobileSidebarContent?: ReactNode;
}

export const MobileSidebar = ({
  isOpen,
  onClose,
  sidebarContent,
  mobileSidebarContent
}: MobileSidebarProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden transition-opacity duration-200",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        role="presentation"
      />
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 h-full w-72 max-w-[80vw] bg-white shadow-xl transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
            <span className="text-sm font-semibold text-gray-700">Sections</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            {mobileSidebarContent ? (
              <ScrollArea className="h-full">{mobileSidebarContent}</ScrollArea>
            ) : (
              sidebarContent
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
