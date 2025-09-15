"use client";

import { FunctionUI } from "./FunctionUI";

// Props'ların tipini belirliyoruz
interface ContractReaderProps {
    contractConfig: {
        address: `0x${string}`;
        abi: any[];
    };
}

export function ContractReader({ contractConfig }: ContractReaderProps) {
    // ABI'ı filtreleyerek sadece 'view' veya 'pure' olan okuma fonksiyonlarını al
    const readFunctions = contractConfig.abi.filter(
        (fn: any) =>
            fn.type === "function" &&
            (fn.stateMutability === "view" || fn.stateMutability === "pure")
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold border-b pb-2">
                Okuma Fonksiyonları (View/Pure)
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
                    Bu kontratta okunabilir fonksiyon bulunamadı.
                </p>
            )}
        </div>
    );
}
