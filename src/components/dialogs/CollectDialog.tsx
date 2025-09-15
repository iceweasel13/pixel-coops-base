import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export function CollectDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-[#db9c74] border-[#b5785a] border-8 p-5 sm:p-6"
        showCloseButton={false}
      >
        <DialogClose
          aria-label="Kapat"
          className="absolute right-3 top-3 size-10 cursor-pointer rounded-xs border-0 bg-transparent opacity-90 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0"
        >
          <img
            src="/icons/close.png"
            alt="Kapat"
            className="pointer-events-none block h-10 w-10 select-none"
          />
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-black/90">Toplama Alanı</DialogTitle>
          <DialogDescription className="text-sm text-black/80">
            Burada yumurtaları toplayıp tokena çevirebilirsin.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
