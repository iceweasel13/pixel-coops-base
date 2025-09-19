"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { chickenFarmContract } from "@/contracts";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Define all tabs and their links here
    const tabs = [
        { name: "Read (Game)", href: "/admin/read" },
        { name: "User (Game)", href: "/admin/user" },
        { name: "Admin (Game)", href: "/admin/owner" },
        { name: "Token Management", href: "/admin/token", variant: "destructive" as const }, // Special style for token page
    ];

    const isTokenPage = pathname === "/admin/token";

    const content = (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-4xl font-bold mb-2">
                Contract Management Panel
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
        // AdminGuard protects all admin pages except the token page
        <AdminGuard contractConfig={chickenFarmContract}>
            {content}
        </AdminGuard>
    );
}
