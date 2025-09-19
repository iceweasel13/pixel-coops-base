"use client";

import { useState } from 'react';
import Link from 'next/link';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { ContractReader } from '@/components/admin/ContractReader';
import { ContractWriter } from '@/components/admin/ContractWriter';
import { Button } from '@/components/ui/button';
import { chickenFarmContract } from '@/contracts';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'read' | 'user_write' | 'admin_write'>('read');
  
  const adminFunctions = [
    "addChicken", "toggleHeroProduction", "addFarm", "toggleFarmProduction", 
    "addSecondaryMarketForChicken", "setEggcoin", "setEggtoshi", "setInitialFarmPrice", 
    "setReferralFee", "setBurnPct", "setCooldown", "withdraw", "withdrawEggcoin", 
    "changeChickenCost", "changeFarmCost", "transferOwnership", "renounceOwnership"
  ];

  return (
    <AdminGuard contractConfig={chickenFarmContract}>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl font-bold mb-2">Game Contract Management</h1>
        <p className="text-muted-foreground mb-8 truncate text-sm">
          {chickenFarmContract.address}
        </p>

        {/* Tabs preserving existing layout */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b pb-4">
          <Button variant={activeTab === 'read' ? 'default' : 'outline'} onClick={() => setActiveTab('read')}>
            Read (Game)
          </Button>
          <Button variant={activeTab === 'user_write' ? 'default' : 'outline'} onClick={() => setActiveTab('user_write')}>
            User (Game)
          </Button>
          <Button variant={activeTab === 'admin_write' ? 'default' : 'outline'} onClick={() => setActiveTab('admin_write')}>
            Admin (Game)
          </Button>
          {/* Added a new link only */}
          <Link href="/admin/token" passHref>
            <Button variant='destructive' >Go to Token Management →</Button>
          </Link>
        </div>
        
        {/* Content */}
        <div>
          {activeTab === 'read' && <ContractReader contractConfig={chickenFarmContract} />}
          {activeTab === 'user_write' && <ContractWriter contractConfig={chickenFarmContract} filter={(fn) => !adminFunctions.includes(fn.name)} title="User Write Functions" />}
          {activeTab === 'admin_write' && <ContractWriter contractConfig={chickenFarmContract} filter={(fn) => adminFunctions.includes(fn.name)} title="Admin Write Functions" />}
        </div>
      </div>
    </AdminGuard>
  );
}
