import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

export function ShopDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dükkan</DialogTitle>
          <DialogDescription>
            Burada tavuklar için eşyalar ve yemler satılıyor. Ne almak istersin?
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}