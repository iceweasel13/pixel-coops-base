import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

export function CoopDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tavuk Kümesi</DialogTitle>
          <DialogDescription>
            Tavukların mutlu görünüyor! Yumurtaları toplamak ister misin?
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}