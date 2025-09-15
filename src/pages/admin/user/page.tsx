"use client";
import { FunctionUI } from "@/components/admin/FunctionUI";
import { chickenFarmContract } from "@/contracts";

// Sadece owner'ın çağırabildiği fonksiyonları filtrelemek için liste
const ownerFunctionNames = [
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

export default function UserFunctionsPage() {
    const userWriteFunctions = chickenFarmContract.abi.filter(
        (fn: any) =>
            fn.type === "function" &&
            (fn.stateMutability === "payable" ||
                fn.stateMutability === "nonpayable") &&
            !ownerFunctionNames.includes(fn.name)
    );

    return (
        <div className="space-y-6">
            {userWriteFunctions.map((func: any) => (
                <FunctionUI
                    key={func.name}
                    func={func}
                    contractConfig={chickenFarmContract}
                    type="write"
                />
            ))}
        </div>
    );
}

