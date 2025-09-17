"use client";

import { useState } from 'react';
import Link from 'next/link';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { ContractReader } from '@/components/admin/ContractReader';
import { ContractWriter } from '@/components/admin/ContractWriter';
import { Button } from '@/components/ui/button';
import { eggTokenContract, chickenFarmContract } from '@/contracts';

export default function TokenAdminPage() {
  const [activeTab, setActiveTab] = useState<'read' | 'write'>('read');

  return (
    // Bu sayfanın güvenliği Eggcoin kontratının sahibi üzerinden sağlanır.
    <AdminGuard contractConfig={eggTokenContract}>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl font-bold mb-2">Token Kontratı Yönetimi ($EGG)</h1>
        <p className="text-muted-foreground mb-8 truncate text-sm">
          {eggTokenContract.address}
        </p>

        {/* Sekme Butonları */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b pb-4">
            <Button variant={activeTab === 'read' ? 'default' : 'outline'} onClick={() => setActiveTab('read')}>
                Okuma (Token)
            </Button>
            <Button variant={activeTab === 'write' ? 'default' : 'outline'} onClick={() => setActiveTab('write')}>
                Yazma (Token)
            </Button>
            <Link href="/admin" passHref>
                <Button variant='secondary'>← Ana Panele Geri Dön</Button>
            </Link>
        </div>
        
        <div>
          {activeTab === 'read' && <ContractReader contractConfig={eggTokenContract} />}
          {activeTab === 'write' && <ContractWriter contractConfig={eggTokenContract} title="Token Yazma Fonksiyonları" />}
        </div>

        <div className="mt-8 p-4 border rounded-lg bg-muted">
            <h3 className="font-bold">`setMinter` Nasıl Kullanılır?</h3>
            <p className="text-sm text-muted-foreground mt-2">
                `claimRewards` fonksiyonunun çalışması için, Yazma (Token) sekmesindeki `setMinter` fonksiyonunu bulup, input alanına aşağıdaki Ana Oyun Kontratı adresini yapıştırmanız ve işlemi onaylamanız gerekmektedir:
            </p>
            <p className="font-mono bg-background p-2 rounded-md mt-2 text-xs break-all">
                {chickenFarmContract.address}
            </p>
        </div>
      </div>
    </AdminGuard>
  );
}
