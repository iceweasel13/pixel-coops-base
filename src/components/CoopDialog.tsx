import { DialogPanel } from "./DialogPanel";

export function CoopDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <DialogPanel
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Tavuk Kümesi"
    >
      <p className="text-sm text-black/80">
        Tavukların mutlu görünüyor! Yumurtaları toplamak ister misin?
      </p>
    </DialogPanel>
  );
}

