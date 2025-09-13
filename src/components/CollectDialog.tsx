import { DialogPanel } from "./DialogPanel";

export function CollectDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <DialogPanel
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Toplama Alanı"
    >
      <p className="text-sm text-black/80">
        Burada yumurtaları toplayıp tokena çevirebilirsin.
      </p>
    </DialogPanel>
  );
}

