"use client";

import {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect,
    useCallback,
} from "react";
import { useAccount, useReadContracts, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { chickenFarmContract, eggTokenContract } from "@/contracts";
import { toast } from "sonner";
import { parseEther } from "viem";
import { Abi } from "abitype";
import { config } from "@/config";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// Types GÃœNCELLENDÄ°
export interface IPlayerFarm {
    farmIndex: number;
    maxChickens: number;
    currChickens: number;
    totalProductionPower: bigint;
    currProductionPower: bigint;
    x: number;
    y: number;
}
interface IPlayerData {
    hasFreeChicken: boolean;
    pendingRewards: bigint;
    farmUpgradeCooldown: number;
    eggTokenBalance: bigint;
    eggTokenAllowance: bigint;
    totalReferrals: number; // YENÄ° EKLENDÄ°
    totalReferralBonus: bigint; // YENÄ° EKLENDÄ°
}
interface IGameContext {
    playerFarm: IPlayerFarm | null;
    playerData: IPlayerData;
    playerChickens: any[];
    isLoading: boolean;
    isConfirming: boolean;
    referralAddress: string;
    totalHashPower: bigint;
    playerPower: bigint;
    purchaseInitialFarm: (referral?: string) => void;
    getFreeStarterChicken: () => void;
    buyChicken: (chickenIndex: number) => void;
    buyNewFarm: () => void;
    claimRewards: () => void;
    approveEggTokens: () => void;
    refetchData: () => void;
}

const GameContext = createContext<IGameContext | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const { address, isConnected } = useAccount();
    const [isConfirming, setIsConfirming] = useState(false);
    const [referralAddress, setReferralAddress] = useState("");
    const [totalHashPower, setTotalHashPower] = useState<bigint>(BigInt(0));
    const [playerPower, setPlayerPower] = useState<bigint>(BigInt(0));

    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedReferral = window.localStorage.getItem("referralAddress") || "";
        if (storedReferral) {
            setReferralAddress(storedReferral);
        }

        const params = new URLSearchParams(window.location.search);
        const referralFromUrl = params.get("ref");
        if (referralFromUrl) {
            const trimmedReferral = referralFromUrl.trim();
            setReferralAddress(trimmedReferral);
            window.localStorage.setItem("referralAddress", trimmedReferral);
        }
    }, []);

    // useReadContracts GÃœNCELLENDÄ°: Referans fonksiyonlarÄ± eklendi
    const {
        data: contractData,
        isLoading: isLoadingReads,
        refetch,
    } = useReadContracts({
        allowFailure: true,
        contracts: [
            {
                abi: chickenFarmContract.abi as Abi,
                address: chickenFarmContract.address,
                functionName: "ownerToFarm",
                args: [address!],
            },
            {
                abi: chickenFarmContract.abi as Abi,
                address: chickenFarmContract.address,
                functionName: "acquiredStarterChicken",
                args: [address!],
            },
            {
                abi: chickenFarmContract.abi as Abi,
                address: chickenFarmContract.address,
                functionName: "pendingRewards",
                args: [address!],
            },
            {
                abi: chickenFarmContract.abi as Abi,
                address: chickenFarmContract.address,
                functionName: "timeUntilNextFarmUpgrade",
                args: [address!],
            },
            {
                abi: chickenFarmContract.abi as Abi,
                address: chickenFarmContract.address,
                functionName: "getPlayerChickensPaginated",
                args: [address!, BigInt(0), 10],
            },
            {
                abi: eggTokenContract.abi as Abi,
                address: eggTokenContract.address,
                functionName: "balanceOf",
                args: [address!],
            },
            {
                abi: eggTokenContract.abi as Abi,
                address: eggTokenContract.address,
                functionName: "allowance",
                args: [address!, chickenFarmContract.address],
            },
            // --- YENÄ° EKLENEN OKUMALAR ---
            {
                abi: chickenFarmContract.abi as Abi,
                address: chickenFarmContract.address,
                functionName: "getReferrals",
                args: [address!],
            },
            {
                abi: chickenFarmContract.abi as Abi,
                address: chickenFarmContract.address,
                functionName: "referralBonusPaid",
                args: [address!],
            },
            // Production power related reads
            {
                abi: chickenFarmContract.abi as Abi,
                address: chickenFarmContract.address,
                functionName: "totalHashPower",
            },
            {
                abi: chickenFarmContract.abi as Abi,
                address: chickenFarmContract.address,
                functionName: "playerPower",
                args: [address!],
            },
        ],
        query: {
            enabled: isConnected && !!address,
            refetchInterval: isConnected ? 2500 : false,
            refetchOnWindowFocus: true,
        },
    });

    const [playerFarm, setPlayerFarm] = useState<IPlayerFarm | null>(null);
    // BaÅŸlangÄ±Ã§ state'i GÃœNCELLENDÄ°
    const [playerData, setPlayerData] = useState<IPlayerData>({
        hasFreeChicken: false,
        pendingRewards: BigInt(0),
        farmUpgradeCooldown: 0,
        eggTokenBalance: BigInt(0),
        eggTokenAllowance: BigInt(0),
        totalReferrals: 0,
        totalReferralBonus: BigInt(0),
    });
    const [playerChickens, setPlayerChickens] = useState<any[]>([]);

    const refetchData = useCallback(() => {
        if (isConnected) refetch();
    }, [isConnected, refetch]);

    // Veri iÅŸleme useEffect'i GÃœNCELLENDÄ°
    useEffect(() => {
        if (contractData) {
            const [
                farmInfoResult,
                hasFreeChicken,
                pendingRewards,
                farmUpgradeCooldown,
                ownedChickens,
                eggBalance,
                eggAllowance,
                referrals,
                referralBonus,
                totalHashPowerRead,
                playerPowerRead,
            ] = contractData.map((d) => d.result);
            if (
                farmInfoResult &&
                Array.isArray(farmInfoResult) &&
                farmInfoResult.length > 0
            ) {
                setPlayerFarm({
                    farmIndex: Number(farmInfoResult[0]),
                    maxChickens: Number(farmInfoResult[1]),
                    currChickens: Number(farmInfoResult[2]),
                    totalProductionPower: farmInfoResult[3] as bigint,
                    currProductionPower: farmInfoResult[4] as bigint,
                    x: Number(farmInfoResult[5]),
                    y: Number(farmInfoResult[6]),
                });
            } else {
                setPlayerFarm(null);
            }
            setPlayerData({
                hasFreeChicken: hasFreeChicken as boolean,
                pendingRewards: (pendingRewards as bigint) || BigInt(0),
                farmUpgradeCooldown: Number(farmUpgradeCooldown as bigint) || 0,
                eggTokenBalance: (eggBalance as bigint) || BigInt(0),
                eggTokenAllowance: (eggAllowance as bigint) || BigInt(0),
                // YENÄ° VERÄ°LERÄ° STATE'E EKLE
                totalReferrals: (referrals as any[])?.length || 0,
                totalReferralBonus: (referralBonus as bigint) || BigInt(0),
            });
            setPlayerChickens((ownedChickens as any[]) || []);
            // Set production power values
            setTotalHashPower((totalHashPowerRead as bigint) || BigInt(0));
            setPlayerPower((playerPowerRead as bigint) || BigInt(0));
        }
    }, [contractData]);

    // handleTransaction ve diÄŸer fonksiyonlar aynÄ± kalÄ±yor...
    const { writeContractAsync } = useWriteContract();
    type BaseWriteParams = Parameters<typeof writeContractAsync>[0];
    type WriteParams = Omit<BaseWriteParams, "value"> & { value?: bigint };
    const isUserRejection = (err: any) => {
        const msg = (err?.shortMessage || err?.message || "")
            .toString()
            .toLowerCase();
        return (
            err?.code === 4001 ||
            err?.name === "UserRejectedRequestError" ||
            err?.cause?.name === "UserRejectedRequestError" ||
            msg.includes("user rejected") ||
            msg.includes("rejected the request")
        );
    };
    const handleTransaction = async (params: WriteParams) => {
        if (!isConnected) {
            toast.error("Please connect your wallet.");
            return;
        }
        let toastId: string | number = "";
        try {
            setIsConfirming(true);
            toastId = toast.loading(
                "Please approve the transaction in your wallet."
            );
            const hash = await writeContractAsync(params as BaseWriteParams);
            toast.loading("Confirming transaction...", { id: toastId });
            await waitForTransactionReceipt(config, { hash, confirmations: 1 });
            toast.success("Transaction confirmed. Refreshing data...", {
                id: toastId,
                duration: 3000,
            });
            await refetch();
        } catch (error: any) {
            if (isUserRejection(error)) {
                toast.info("Transaction canceled by user.", {
                    id: toastId,
                    duration: 2500,
                });
            } else {
                console.error("Transaction Error:", error);
                toast.error(
                    `Transaction failed: ${
                        error.shortMessage || error.message
                    }`,
                    { id: toastId, duration: 5000 }
                );
            }
        } finally {
            setIsConfirming(false);
        }
    };
    const findNextAvailableSlot = (): { x: number; y: number } | null => {
        if (!playerFarm || playerFarm.currChickens >= playerFarm.maxChickens)
            return null;
        return { x: 0, y: playerFarm.currChickens };
    };
    const approveEggTokens = () => {
        const maxAllowance = BigInt(
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );
        handleTransaction({
            address: eggTokenContract.address,
            abi: eggTokenContract.abi,
            functionName: "approve",
            args: [chickenFarmContract.address, maxAllowance],
        });
    };
    const purchaseInitialFarm = (overrideReferral?: string) => {
        const candidateReferral = (overrideReferral ?? referralAddress ?? "").trim();
        const referralToUse = candidateReferral || ZERO_ADDRESS;
        handleTransaction({
            address: chickenFarmContract.address,
            abi: chickenFarmContract.abi,
            functionName: "purchaseInitialFarm",
            args: [referralToUse],
            value: parseEther("0.005"),
        });
    };
    const getFreeStarterChicken = () => {
        const slot = findNextAvailableSlot();
        if (slot)
            handleTransaction({
                address: chickenFarmContract.address,
                abi: chickenFarmContract.abi,
                functionName: "getFreeStarterChicken",
                args: [slot.x, slot.y],
            });
        else toast.error("No available space in your farm.");
    };
    const buyChicken = (chickenIndex: number) => {
        const slot = findNextAvailableSlot();
        if (slot)
            handleTransaction({
                address: chickenFarmContract.address,
                abi: chickenFarmContract.abi,
                functionName: "buyChicken",
                args: [chickenIndex, slot.x, slot.y],
            });
        else toast.error("No available space in your farm.");
    };
    const buyNewFarm = () =>
        handleTransaction({
            address: chickenFarmContract.address,
            abi: chickenFarmContract.abi,
            functionName: "buyNewFarm",
            args: [],
        });
    const claimRewards = () =>
        handleTransaction({
            address: chickenFarmContract.address,
            abi: chickenFarmContract.abi,
            functionName: "claimRewards",
            args: [],
        });

    const contextValue: IGameContext = {
        playerFarm,
        playerData,
        playerChickens,
        isLoading: isLoadingReads && isConnected,
        isConfirming,
        referralAddress,
        totalHashPower,
        playerPower,
        purchaseInitialFarm,
        getFreeStarterChicken,
        buyChicken,
        buyNewFarm,
        claimRewards,
        approveEggTokens,
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
    if (context === undefined)
        throw new Error("useGame must be used within a GameProvider");
    return context;
};


