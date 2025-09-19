"use client";

import { FunctionUI } from "./FunctionUI";

// Define props types
interface ContractWriterProps {
    contractConfig: {
        address: `0x${string}`;
        abi: any[];
    };
    filter?: (fn: any) => boolean; // Optional prop to filter functions
    title: string;
}

export function ContractWriter({
    contractConfig,
    filter,
    title,
}: ContractWriterProps) {
    // Filter ABI to get only state-changing (write) functions
    let writeFunctions = contractConfig.abi.filter(
        (fn: any) =>
            fn.type === "function" &&
            (fn.stateMutability === "payable" ||
                fn.stateMutability === "nonpayable")
    );

    // If a filter function is provided, re-filter the list accordingly
    if (filter) {
        writeFunctions = writeFunctions.filter(filter);
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold border-b pb-2">{title}</h2>
            {writeFunctions.length > 0 ? (
                writeFunctions.map((func: any) => (
                    <FunctionUI
                        key={func.name}
                        func={func}
                        contractConfig={contractConfig}
                        type="write"
                    />
                ))
            ) : (
                <p className="text-muted-foreground">
                    No writable functions found in this category.
                </p>
            )}
        </div>
    );
}
