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
    // This page is secured by the Eggcoin contract owner.
    <AdminGuard contractConfig={eggTokenContract}>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl font-bold mb-2">Token Contract Management ($EGG)</h1>
        <p className="text-muted-foreground mb-8 truncate text-sm">
          {eggTokenContract.address}
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b pb-4">
            <Button variant={activeTab === 'read' ? 'default' : 'outline'} onClick={() => setActiveTab('read')}>
                Read (Token)
            </Button>
            <Button variant={activeTab === 'write' ? 'default' : 'outline'} onClick={() => setActiveTab('write')}>
                Write (Token)
            </Button>
            <Link href="/admin" passHref>
                <Button variant='secondary'>← Back to Main Panel</Button>
            </Link>
        </div>
        
        <div>
          {activeTab === 'read' && <ContractReader contractConfig={eggTokenContract} />}
          {activeTab === 'write' && <ContractWriter contractConfig={eggTokenContract} title="Token Write Functions" />}
        </div>

        <div className="mt-8 p-4 border rounded-lg bg-muted">
            <h3 className="font-bold">How to use `setMinter`?</h3>
            <p className="text-sm text-muted-foreground mt-2">
                For `claimRewards` to work, go to the Write (Token) tab, find the `setMinter` function, paste the following Main Game Contract address into the input, and approve the transaction:
            </p>
            <p className="font-mono bg-background p-2 rounded-md mt-2 text-xs break-all">
                {chickenFarmContract.address}
            </p>
        </div>
      </div>
    </AdminGuard>
  );
}
