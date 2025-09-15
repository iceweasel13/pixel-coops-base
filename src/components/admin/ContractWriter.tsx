"use client";

import { FunctionUI } from "./FunctionUI";

// Props'ların tipini belirliyoruz
interface ContractWriterProps {
    contractConfig: {
        address: `0x${string}`;
        abi: any[];
    };
    filter?: (fn: any) => boolean; // Fonksiyonları filtrelemek için opsiyonel bir prop
    title: string;
}

export function ContractWriter({
    contractConfig,
    filter,
    title,
}: ContractWriterProps) {
    // ABI'ı filtreleyerek sadece state değiştiren (yazma) fonksiyonlarını al
    let writeFunctions = contractConfig.abi.filter(
        (fn: any) =>
            fn.type === "function" &&
            (fn.stateMutability === "payable" ||
                fn.stateMutability === "nonpayable")
    );

    // Eğer bir filtre fonksiyonu gönderildiyse, listeyi ona göre tekrar filtrele
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
                    Bu kategoride yazılabilir fonksiyon bulunamadı.
                </p>
            )}
        </div>
    );
}
