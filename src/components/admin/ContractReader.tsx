"use client";

import { FunctionUI } from "./FunctionUI";

// Define props types
interface ContractReaderProps {
    contractConfig: {
        address: `0x${string}`;
        abi: any[];
    };
}

export function ContractReader({ contractConfig }: ContractReaderProps) {
    // Filter ABI to get only 'view' and 'pure' read functions
    const readFunctions = contractConfig.abi.filter(
        (fn: any) =>
            fn.type === "function" &&
            (fn.stateMutability === "view" || fn.stateMutability === "pure")
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold border-b pb-2">
                Read Functions (View/Pure)
            </h2>
            {readFunctions.length > 0 ? (
                readFunctions.map((func: any) => (
                    <FunctionUI
                        key={func.name}
                        func={func}
                        contractConfig={contractConfig}
                        type="read"
                    />
                ))
            ) : (
                <p className="text-muted-foreground">
                    No readable functions found in this contract.
                </p>
            )}
        </div>
    );
}
