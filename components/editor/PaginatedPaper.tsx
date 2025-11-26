"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PaginatedPaperProps {
  children: ReactNode;
  header: ReactNode;
  className?: string;
}

/**
 * PaginatedPaper: Wraps content in a multi-page A4 layout
 * Content flows naturally but is visually contained in page boundaries
 */
export function PaginatedPaper({ children, header, className = "" }: PaginatedPaperProps) {
  return (
    <div className={cn("pages-container mx-auto", className)}>
      {/* Page 1 with header */}
      <div className="page-container">
        <div className="p-[15mm] min-h-[297mm] flex flex-col">
          {/* Header - fixed at top of first page */}
          <div className="mb-8 flex-shrink-0">
            {header}
          </div>
          
          {/* Content area - this is where DragDropContext will render */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>

      {/* Additional pages will be added dynamically based on content overflow */}
      {/* For now, we render a continuous space that looks like pages */}
    </div>
  );
}

