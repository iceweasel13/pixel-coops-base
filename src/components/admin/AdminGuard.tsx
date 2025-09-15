"use client";

import { useAccount, useReadContract } from "wagmi";

// Bu component'in alacağı props'ların tipini tanımlıyoruz
interface AdminGuardProps {
    children: React.ReactNode;
    contractConfig: {
        address: `0x${string}`;
        abi: any;
    };
}

export function AdminGuard({ children, contractConfig }: AdminGuardProps) {
    const { address: connectedAddress, isConnected } = useAccount();

    // Kontratın 'owner' fonksiyonunu çağırarak sahibinin adresini alıyoruz
    const {
        data: ownerAddress,
        isLoading,
        error,
    } = useReadContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: "owner",
    });

    if (isLoading) {
        return (
            <div className="p-10 text-center">
                Admin yetkisi kontrol ediliyor...
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="p-10 text-center">Lütfen cüzdanınızı bağlayın.</div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center text-destructive">
                <h2 className="text-2xl font-bold">Kontrat Okuma Hatası</h2>
                <p className="mt-2 text-sm">{error.message}</p>
            </div>
        );
    }

    if (ownerAddress !== connectedAddress) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold text-destructive">
                    Erişim Reddedildi
                </h2>
                <p className="mt-2">
                    Bu sayfayı sadece kontrat sahibi görüntüleyebilir.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    Bağlı Adres: {connectedAddress}
                </p>
            </div>
        );
    }

    // Eğer tüm kontrollerden geçerse, içeriği göster
    return <>{children}</>;
}
