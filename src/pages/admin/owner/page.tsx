"use client";
import { FunctionUI } from "@/components/admin/FunctionUI";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { chickenFarmContract } from "@/contracts";

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

export default function OwnerFunctionsPage() {
    const adminWriteFunctions = chickenFarmContract.abi.filter(
        (fn: any) =>
            fn.type === "function" &&
            (fn.stateMutability === "payable" ||
                fn.stateMutability === "nonpayable") &&
            ownerFunctionNames.includes(fn.name)
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {adminWriteFunctions.map((func: any) => (
                    <FunctionUI
                        key={func.name}
                        func={func}
                        contractConfig={chickenFarmContract}
                        type="write"
                    />
                ))}
            </div>
        </AdminLayout>
    );
}
