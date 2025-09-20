"use client";
import { FunctionUI } from "@/components/admin/FunctionUI";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { chickenFarmContract } from "@/contracts";

export default function ReadFunctionsPage() {
    const readFunctions = chickenFarmContract.abi.filter(
        (fn: any) =>
            fn.type === "function" &&
            (fn.stateMutability === "view" || fn.stateMutability === "pure")
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {readFunctions.map((func: any) => (
                    <FunctionUI
                        key={func.name}
                        func={func}
                        contractConfig={chickenFarmContract}
                        type="read"
                    />
                ))}
            </div>
        </AdminLayout>
    );
}
