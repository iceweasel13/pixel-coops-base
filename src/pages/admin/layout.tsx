"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { chickenFarmContract } from "@/contracts";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const tabs = [
        { name: "Okuma Fonksiyonları", href: "/admin/read" },
        { name: "Kullanıcı Fonksiyonları", href: "/admin/user" },
        { name: "Admin Fonksiyonları", href: "/admin/owner" },
    ];

    return (
        <AdminGuard contractConfig={chickenFarmContract}>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <h1 className="text-4xl font-bold mb-2">
                    Kontrat Yönetim Paneli
                </h1>
                <p className="text-muted-foreground mb-8 truncate text-sm">
                    {chickenFarmContract.address}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-8 border-b pb-4">
                    {tabs.map((tab) => (
                        <Link key={tab.name} href={tab.href} passHref>
                            <Button
                                variant={
                                    pathname === tab.href
                                        ? "default"
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
        </AdminGuard>
    );
}

