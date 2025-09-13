import { DialogPanel } from "./DialogPanel";

export function ShopDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <DialogPanel
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Mağaza"
    >
      <p className="text-sm text-black/80">
        Burada tavuklar için eşyalar ve yemler satılıyor. Ne almak istersin?
      </p>
    </DialogPanel>
  );
}

