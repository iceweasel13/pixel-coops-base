import React from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "./ui/dialog";

type DialogPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children?: React.ReactNode;
  closeAriaLabel?: string;
};

export function DialogPanel({
  open,
  onOpenChange,
  title,
  children,
  closeAriaLabel = "Kapat",
}: DialogPanelProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // Disable default XIcon button; we add our own image button
        showCloseButton={false}
        className="bg-[#db9c74] border-[#b5785a] border-8 p-5 sm:p-6"
      >
        {/* Close button (top-right) using public/icons/close.png */}
        <DialogClose
          aria-label={closeAriaLabel}
          className="absolute right-3 top-3 size-10 cursor-pointer rounded-xs border-0 bg-transparent opacity-90 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0"
        >
          <img
            src="/icons/close.png"
            alt={closeAriaLabel}
            className="pointer-events-none block h-10 w-10 select-none"
          />
        </DialogClose>

        {/* Title centered at the top */}
        <div className="mb-2 text-center text-lg font-semibold text-black/90">
          {title}
        </div>

        {/* Body content */}
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
