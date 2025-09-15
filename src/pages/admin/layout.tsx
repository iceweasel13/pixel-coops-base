"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { chickenFarmContract } from "@/contracts";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Tüm sekmeleri ve linklerini burada tanımlıyoruz
    const tabs = [
        { name: "Okuma (Oyun)", href: "/admin/read" },
        { name: "Kullanıcı (Oyun)", href: "/admin/user" },
        { name: "Admin (Oyun)", href: "/admin/owner" },
        { name: "Token Yönetimi", href: "/admin/token", variant: "destructive" as const }, // Token sayfası için özel stil
    ];

    const isTokenPage = pathname === "/admin/token";

    const content = (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-4xl font-bold mb-2">
                Kontrat Yönetim Paneli
            </h1>
            <p className="text-muted-foreground mb-8 truncate text-sm">
                {chickenFarmContract.address}
            </p>

            {/* Sekme Navigasyonu */}
            <div className="flex flex-wrap items-center gap-2 mb-8 border-b pb-4">
                {tabs.map((tab) => (
                    <Link key={tab.name} href={tab.href} passHref>
                        <Button
                            variant={
                                pathname === tab.href
                                    ? tab.variant || "default"
                                    : "outline"
                            }
                        >
                            {tab.name}
                        </Button>
                    </Link>
                ))}
            </div>

           
            <main>{children}</main>
        </div>
    );

    return isTokenPage ? (
        content
    ) : (
        // AdminGuard, token sayfası hariç tüm admin sayfalarını korur
        <AdminGuard contractConfig={chickenFarmContract}>
            {content}
        </AdminGuard>
    );
}
