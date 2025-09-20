"use client";

import { useRouter } from "next/router";
import Link from "next/link";
import { type ReactNode } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { chickenFarmContract } from "@/contracts";
import { Button } from "@/components/ui/button";

const tabs = [
    { name: "Read (Game)", href: "/admin/read" },
    { name: "User (Game)", href: "/admin/user" },
    { name: "Admin (Game)", href: "/admin/owner" },
    { name: "Token Management", href: "/admin/token", variant: "destructive" as const },
];

type AdminLayoutProps = {
    children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const activePath = router.asPath || router.pathname;
    const isTokenPage = activePath.startsWith("/admin/token");

    const content = (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-4xl font-bold mb-2">Contract Management Panel</h1>
            <p className="text-muted-foreground mb-8 truncate text-sm">
                {chickenFarmContract.address}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-8 border-b pb-4">
                {tabs.map((tab) => {
                    const isActive = activePath === tab.href || activePath.startsWith(`${tab.href}/`);
                    return (
                        <Button
                            key={tab.name}
                            asChild
                            variant={isActive ? tab.variant || "default" : "outline"}
                        >
                            <Link href={tab.href}>{tab.name}</Link>
                        </Button>
                    );
                })}
            </div>

            <main>{children}</main>
        </div>
    );

    return isTokenPage ? content : (
        <AdminGuard contractConfig={chickenFarmContract}>{content}</AdminGuard>
    );
}
