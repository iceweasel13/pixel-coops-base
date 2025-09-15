"use client";

import { useState } from "react";
// DEĞİŞİKLİK: 'components' artık src klasörünün altında olduğu için @/ ile başlar
import { AdminGuard } from "@/components/admin/AdminGuard";
import { Button } from "@/components/ui/button";
import { chickenFarmContract } from "@/contracts";
import { ContractReader } from "@/components/admin/ContractReader";
import { ContractWriter } from "@/components/admin/ContractWriter";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<
        "read" | "user_write" | "admin_write"
    >("read");

    // Admin (owner) yetkisi gerektiren fonksiyonların listesi
    const adminFunctions = [
        "addChicken",
        "toggleHeroProduction",
        "addFarm",
        "toggleFarmProduction",
        "addSecondaryMarketForChicken",
        "setEggcoin",
        "setEggtoshi",
        "setInitialFarmPrice",
        "setReferralFee",
        "setBurnPct",
        "setCooldown",
        "withdraw",
        "withdrawEggcoin",
        "changeChickenCost",
        "changeFarmCost",
        "transferOwnership",
        "renounceOwnership",
    ];

    return (
        // AdminGuard, tüm sayfayı sarmalayarak güvenlik sağlar
        <AdminGuard contractConfig={chickenFarmContract}>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <h1 className="text-4xl font-bold mb-2">
                    Kontrat Yönetim Paneli
                </h1>
                <p className="text-muted-foreground mb-8 truncate text-sm">
                    {chickenFarmContract.address}
                </p>

                {/* Sekme Butonları */}
                <div className="flex flex-wrap items-center gap-2 mb-8 border-b pb-4">
                    <Button
                        variant={activeTab === "read" ? "default" : "outline"}
                        onClick={() => setActiveTab("read")}
                    >
                        Okuma Fonksiyonları
                    </Button>
                    <Button
                        variant={
                            activeTab === "user_write" ? "default" : "outline"
                        }
                        onClick={() => setActiveTab("user_write")}
                    >
                        Kullanıcı Fonksiyonları
                    </Button>
                    <Button
                        variant={
                            activeTab === "admin_write" ? "default" : "outline"
                        }
                        onClick={() => setActiveTab("admin_write")}
                    >
                        Admin Fonksiyonları
                    </Button>
                </div>

                {/* Seçili Sekmeye Göre İlgili Component'i Göster */}
                <div>
                    {activeTab === "read" && (
                        <ContractReader contractConfig={chickenFarmContract} />
                    )}
                    {activeTab === "user_write" && (
                        <ContractWriter
                            contractConfig={chickenFarmContract}
                            // Admin fonksiyonları DIŞINDAKİLERİ filtrele
                            filter={(fn) => !adminFunctions.includes(fn.name)}
                            title="Kullanıcı Yazma Fonksiyonları"
                        />
                    )}
                    {activeTab === "admin_write" && (
                        <ContractWriter
                            contractConfig={chickenFarmContract}
                            // Sadece admin fonksiyonlarını filtrele
                            filter={(fn) => adminFunctions.includes(fn.name)}
                            title="Admin Yazma Fonksiyonları"
                        />
                    )}
                </div>
            </div>
        </AdminGuard>
    );
}
