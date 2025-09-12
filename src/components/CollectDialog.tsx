import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

export function CollectDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Toplama Alanı</DialogTitle>
          <DialogDescription>
            Burada yumurtaları toplayıp tokena çevirebilirsin.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}