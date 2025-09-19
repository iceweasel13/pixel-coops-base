"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { chickenFarmContract, eggTokenContract } from '@/contracts';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { Abi } from 'abitype';
import { config } from '@/config';

// Types
export interface IPlayerFarm { farmIndex: number; maxChickens: number; currChickens: number; totalProductionPower: bigint; currProductionPower: bigint; x: number; y: number; }
interface IPlayerData { hasFreeChicken: boolean; pendingRewards: bigint; farmUpgradeCooldown: number; eggTokenBalance: bigint; eggTokenAllowance: bigint; }
interface IGameContext {
    playerFarm: IPlayerFarm | null; playerData: IPlayerData; playerChickens: any[]; isLoading: boolean; isConfirming: boolean;
    purchaseInitialFarm: (referral: string) => void; getFreeStarterChicken: () => void;
    buyChicken: (chickenIndex: number) => void; buyNewFarm: () => void; claimRewards: () => void;
    approveEggTokens: () => void; // Updated to take no arguments
    refetchData: () => void;
}

const GameContext = createContext<IGameContext | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const { address, isConnected } = useAccount();
    const [isConfirming, setIsConfirming] = useState(false);
    const { data: contractData, isLoading: isLoadingReads, refetch } = useReadContracts({
        allowFailure: true,
        contracts: [
            { abi: chickenFarmContract.abi as Abi, address: chickenFarmContract.address, functionName: 'ownerToFarm', args: [address!] },
            { abi: chickenFarmContract.abi as Abi, address: chickenFarmContract.address, functionName: 'acquiredStarterChicken', args: [address!] },
            { abi: chickenFarmContract.abi as Abi, address: chickenFarmContract.address, functionName: 'pendingRewards', args: [address!] },
            { abi: chickenFarmContract.abi as Abi, address: chickenFarmContract.address, functionName: 'timeUntilNextFarmUpgrade', args: [address!] },
            { abi: chickenFarmContract.abi as Abi, address: chickenFarmContract.address, functionName: 'getPlayerChickensPaginated', args: [address!, BigInt(0), 10] },
            { abi: eggTokenContract.abi as Abi, address: eggTokenContract.address, functionName: 'balanceOf', args: [address!] },
            { abi: eggTokenContract.abi as Abi, address: eggTokenContract.address, functionName: 'allowance', args: [address!, chickenFarmContract.address] },
        ],
        query: {
            enabled: isConnected && !!address,
            refetchInterval: isConnected ? 5000 : false,
            refetchOnWindowFocus: true,
        },
    });
    
    const [playerFarm, setPlayerFarm] = useState<IPlayerFarm | null>(null);
    const [playerData, setPlayerData] = useState<IPlayerData>({ hasFreeChicken: false, pendingRewards: BigInt(0), farmUpgradeCooldown: 0, eggTokenBalance: BigInt(0), eggTokenAllowance: BigInt(0) });
    const [playerChickens, setPlayerChickens] = useState<any[]>([]);

    const refetchData = useCallback(() => { if(isConnected) refetch(); }, [isConnected, refetch]);
    
    useEffect(() => {
        if (contractData) {
            const [ farmInfoResult, hasFreeChicken, pendingRewards, farmUpgradeCooldown, ownedChickens, eggBalance, eggAllowance ] = contractData.map(d => d.result);
            if (farmInfoResult && Array.isArray(farmInfoResult) && farmInfoResult.length > 0) {
                setPlayerFarm({ farmIndex: Number(farmInfoResult[0]), maxChickens: Number(farmInfoResult[1]), currChickens: Number(farmInfoResult[2]), totalProductionPower: farmInfoResult[3] as bigint, currProductionPower: farmInfoResult[4] as bigint, x: Number(farmInfoResult[5]), y: Number(farmInfoResult[6]), });
            } else { setPlayerFarm(null); }
            setPlayerData({ hasFreeChicken: hasFreeChicken as boolean, pendingRewards: (pendingRewards as bigint) || BigInt(0), farmUpgradeCooldown: Number(farmUpgradeCooldown as bigint) || 0, eggTokenBalance: (eggBalance as bigint) || BigInt(0), eggTokenAllowance: (eggAllowance as bigint) || BigInt(0), });
            setPlayerChickens(ownedChickens as any[] || []);
        }
    }, [contractData]);
    
    const { writeContractAsync } = useWriteContract();
    type BaseWriteParams = Parameters<typeof writeContractAsync>[0];
    type WriteParams = Omit<BaseWriteParams, "value"> & { value?: bigint };
    const isUserRejection = (err: any) => {
        const msg = (err?.shortMessage || err?.message || '').toString().toLowerCase();
        return (
            err?.code === 4001 ||
            err?.name === 'UserRejectedRequestError' ||
            err?.cause?.name === 'UserRejectedRequestError' ||
            msg.includes('user rejected') ||
            msg.includes('rejected the request')
        );
    };

    const handleTransaction = async (params: WriteParams) => {
        if (!isConnected) { toast.error("Please connect your wallet."); return; }
        let toastId: string | number = "";
        try {
            setIsConfirming(true);
            toastId = toast.loading("Please confirm the transaction in your wallet...");
            const hash = await writeContractAsync(params as BaseWriteParams);
            toast.loading("Confirming transaction...", { id: toastId });
            await waitForTransactionReceipt(config, { hash, confirmations: 1 });
            toast.success("Transaction successful! Updating data.", { id: toastId, duration: 3000 });
            await refetch();
        } catch (error: any) {
            if (isUserRejection(error)) {
                toast.info("İşlem iptal edildi.", { id: toastId, duration: 2500 });
            } else {
                console.error("Transaction Error:", error);
                toast.error(`Transaction failed: ${error.shortMessage || error.message}` , { id: toastId, duration: 5000 });
            }
        } finally { setIsConfirming(false); }
    };
    
    const findNextAvailableSlot = (): { x: number; y: number } | null => {
        if (!playerFarm || playerFarm.currChickens >= playerFarm.maxChickens) return null;
        return { x: 0, y: playerFarm.currChickens };
    };
    
    const approveEggTokens = () => {
        const maxAllowance = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        handleTransaction({ address: eggTokenContract.address, abi: eggTokenContract.abi, functionName: "approve", args: [chickenFarmContract.address, maxAllowance] });
    };

    const purchaseInitialFarm = (referral: string) => handleTransaction({ address: chickenFarmContract.address, abi: chickenFarmContract.abi, functionName: "purchaseInitialFarm", args: [referral || "0x0000000000000000000000000000000000000000"], value: parseEther("0.005") });
    const getFreeStarterChicken = () => { const slot = findNextAvailableSlot(); if (slot) handleTransaction({ address: chickenFarmContract.address, abi: chickenFarmContract.abi, functionName: "getFreeStarterChicken", args: [slot.x, slot.y] }); else toast.error("No empty space in your farm!"); };
    const buyChicken = (chickenIndex: number) => { const slot = findNextAvailableSlot(); if (slot) handleTransaction({ address: chickenFarmContract.address, abi: chickenFarmContract.abi, functionName: "buyChicken", args: [chickenIndex, slot.x, slot.y] }); else toast.error("No empty space in your farm!"); };
    const buyNewFarm = () => handleTransaction({ address: chickenFarmContract.address, abi: chickenFarmContract.abi, functionName: "buyNewFarm", args: [] });
    const claimRewards = () => handleTransaction({ address: chickenFarmContract.address, abi: chickenFarmContract.abi, functionName: "claimRewards", args: [] });

    const contextValue: IGameContext = { playerFarm, playerData, playerChickens, isLoading: isLoadingReads && isConnected, isConfirming, purchaseInitialFarm, getFreeStarterChicken, buyChicken, buyNewFarm, claimRewards, approveEggTokens, refetchData };

    return (<GameContext.Provider value={contextValue}>{children}</GameContext.Provider>);
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) throw new Error('useGame must be used within a GameProvider');
    return context;
};




