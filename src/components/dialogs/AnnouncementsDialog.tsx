/**
 * @file AnnouncementsDialog.tsx
 * @description Renders a dialog to display announcements fetched from Supabase.
 */
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase"; // Supabase client'ı import et

// Duyuru objesinin tipini tanımla
type Announcement = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
};

export function AnnouncementDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // State'leri tanımla
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog açıldığında duyuruları çek
  useEffect(() => {
    if (isOpen) {
      const fetchAnnouncements = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('createdAt', { ascending: false }); // En yeni duyuruyu en üstte göster

        if (error) {
          console.error('Error fetching announcements:', error);
        } else if (data) {
          setAnnouncements(data);
        }
        setLoading(false);
      };
      fetchAnnouncements();
    }
  }, [isOpen]);

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
          <Image
            src="/icons/close.png"
            width={100}
            height={100}
            alt="Kapat"
            className="pointer-events-none block h-10 w-10 select-none"
          />
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-black/90 text-2xl mb-2">Announcements</DialogTitle>
        </DialogHeader>
        <div className="max-h-80 overflow-y-auto custom-scrollbar pr-2">
          {loading ? (
            <p className="text-black/80 text-center">Loading announcements...</p>
          ) : announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 bg-white/30 rounded-lg border border-white/40">
                  <h3 className="font-bold text-lg text-[#5a4535]">{ann.title}</h3>
                  <p className="text-sm text-black/80 mt-1">{ann.content}</p>
                  <p className="text-xs text-black/60 text-right mt-2">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-black/80 text-center">No announcements yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}