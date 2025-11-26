import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  isOpen: boolean;
  className?: string;
  onClick?: () => void;
}

export function NavItem({ icon, label, isActive, isOpen, className, onClick }: Props) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        isActive ? "bg-[#082f49] text-white" : "text-gray-600 hover:bg-gray-100",
        !isOpen && "justify-center px-2",
        className
      )}
    >
      <span className="shrink-0 h-5 w-5">{icon}</span>
      {isOpen && <span className="font-medium whitespace-nowrap">{label}</span>}
    </button>
  );
}
