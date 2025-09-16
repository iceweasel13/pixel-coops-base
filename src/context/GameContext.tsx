"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { chickenFarmContract } from '@/contracts';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { Abi } from 'abitype';

// Tipler
export interface IPlayerFarm {
    farmIndex: number;
    maxChickens: number;
    currChickens: number;
    totalProductionPower: bigint;
    currProductionPower: bigint;
    x: number;
    y: number;
}

interface IGameContext {
    playerFarm: IPlayerFarm | null;
    playerData: {
        hasFreeChicken: boolean;
        pendingRewards: bigint;
        farmUpgradeCooldown: number;
    };
    playerChickens: any[];
    shopChickens: any[];
    isLoading: boolean;
    isConfirming: boolean;
    purchaseInitialFarm: (referral: string) => void;
    getFreeStarterChicken: () => void;
    buyChicken: (chickenIndex: number) => void;
    buyNewFarm: () => void;
    claimRewards: () => void;
    refetchData: () => void;
}

const GameContext = createContext<IGameContext | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const { address, isConnected } = useAccount();
    const { writeContractAsync, data: hash } = useWriteContract();

    // State'ler
    const [playerFarm, setPlayerFarm] = useState<IPlayerFarm | null>(null);
    const [playerData, setPlayerData] = useState<IGameContext['playerData']>({
        hasFreeChicken: false,
        pendingRewards: BigInt(0),
        farmUpgradeCooldown: 0,
    });
    const [playerChickens, setPlayerChickens] = useState<any[]>([]);
    const [shopChickens, setShopChickens] = useState<any[]>([]);

    // Veri Çekme
    const { data: contractData, isLoading: isLoadingReads, refetch } = useReadContracts({
        allowFailure: true,
        contracts: [
            { abi: chickenFarmContract.abi as Abi, address: chickenFarmContract.address, functionName: 'ownerToFarm', args: [address!] },
            { abi: chickenFarmContract.abi as Abi, address: chickenFarmContract.address, functionName: 'acquiredStarterChicken', args: [address!] },
            { abi: chickenFarmContract.abi as Abi, address: chickenFarmContract.address, functionName: 'pendingRewards', args: [address!] },
            { abi: chickenFarmContract.abi as Abi, address: chickenFarmContract.address, functionName: 'timeUntilNextFarmUpgrade', args: [address!] },
            { abi: chickenFarmContract.abi as Abi, address: chickenFarmContract.address, functionName: 'getPlayerChickensPaginated', args: [address!, BigInt(0), 10] },
        ],
        query: { enabled: isConnected && !!address }
    });

    const refetchData = useCallback(() => {
        if(isConnected) refetch();
    }, [isConnected, refetch]);
    
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
    
    useEffect(() => {
        if (isConfirmed) {
            toast.success("İşlem onaylandı! Veriler güncelleniyor.");
            refetchData();
        }
    }, [isConfirmed, refetchData]);

    useEffect(() => {
        if (contractData) {
            const [ farmInfoResult, hasFreeChicken, pendingRewards, farmUpgradeCooldown, ownedChickens ] = contractData.map(d => d.result);
            if (farmInfoResult && Array.isArray(farmInfoResult)) {
                const farm: IPlayerFarm = {
                    farmIndex: Number(farmInfoResult[0]),
                    maxChickens: Number(farmInfoResult[1]),
                    currChickens: Number(farmInfoResult[2]),
                    totalProductionPower: farmInfoResult[3] as bigint,
                    currProductionPower: farmInfoResult[4] as bigint,
                    x: Number(farmInfoResult[5]),
                    y: Number(farmInfoResult[6]),
                };
                setPlayerFarm(farm);
                setPlayerData({
                    hasFreeChicken: hasFreeChicken as boolean,
                    pendingRewards: (pendingRewards as bigint) || BigInt(0),
                    farmUpgradeCooldown: Number(farmUpgradeCooldown as bigint) || 0,
                });
                setPlayerChickens(ownedChickens as any[] || []);
            }
        }
    }, [contractData]);

    // --- SENİN MANTIĞINA GÖRE GÜNCELLENMİŞ FONKSİYON ---
    const findNextAvailableSlot = (): { x: number; y: number } | null => {
        if (!playerFarm || playerFarm.currChickens >= playerFarm.maxChickens) {
            return null; // Çiftlik yok veya dolu
        }
        
        // Mantık çok basit: x her zaman 0 olacak (çünkü çiftlik 1 birim genişliğinde).
        // y ise mevcut tavuk sayısına eşit olacak (0 tavuk varsa y=0, 1 tavuk varsa y=1).
        const nextX = 0;
        const nextY = playerFarm.currChickens;

        // Kontrol: Hesaplanan y koordinatı, çiftliğin dikey boyutunu aşıyor mu?
        if (nextY >= playerFarm.y) {
            // Bu durum, bir mantık hatası olduğunu gösterir (örneğin currChickens > maxChickens)
            // ama bir güvenlik katmanı olarak kalmalı.
            console.error("Hesaplanan slot çiftlik sınırları dışında!");
            return null;
        }

        return { x: nextX, y: nextY };
    };

    // --- Yazma Fonksiyonları ---
    const handleTransaction = async (functionName: string, args: any[], value?: bigint) => {
        if (!isConnected) return toast.error("Lütfen cüzdanınızı bağlayın.");
        toast.info("İşlem için cüzdan onayı bekleniyor...");
        try {
            await writeContractAsync({
                address: chickenFarmContract.address,
                abi: chickenFarmContract.abi as Abi,
                functionName,
                args,
                value,
            });
        } catch (error: any) {
            console.error("Transaction Error:", error);
            const reason = error.shortMessage || error.message;
            toast.error(`İşlem Başarısız: ${reason}`);
        }
    };
    
    const purchaseInitialFarm = (referral: string) => {
        const price = parseEther("0.005");
        handleTransaction("purchaseInitialFarm", [referral || "0x0000000000000000000000000000000000000000"], price);
    };

    const getFreeStarterChicken = () => {
        const slot = findNextAvailableSlot();
        if (slot) {
            handleTransaction("getFreeStarterChicken", [slot.x, slot.y]);
        } else {
            toast.error("Çiftliğinde boş yer yok!");
        }
    };

    const buyChicken = (chickenIndex: number) => {
        const slot = findNextAvailableSlot();
        if (slot) {
            handleTransaction("buyChicken", [chickenIndex, slot.x, slot.y]);
        } else {
            toast.error("Çiftliğinde boş yer yok!");
        }
    };
    
    const buyNewFarm = () => handleTransaction("buyNewFarm", []);
    const claimRewards = () => handleTransaction("claimRewards", []);

    const derivedPlayerData = {
        ...playerData,
        hasInitialFarm: !!playerFarm && playerFarm.farmIndex > 0,
    };

    const contextValue: IGameContext = {
        playerFarm,
        playerData: derivedPlayerData,
        playerChickens,
        shopChickens,
        isLoading: isLoadingReads && !playerFarm,
        isConfirming,
        purchaseInitialFarm,
        getFreeStarterChicken,
        buyChicken,
        buyNewFarm,
        claimRewards,
        refetchData,
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};