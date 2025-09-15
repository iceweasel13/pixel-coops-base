"use client";

import { useReadContract, useWriteContract } from "wagmi";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { formatEther, parseEther } from "viem";

interface FunctionUIProps {
    func: any;
    contractConfig: {
        address: `0x${string}`;
        abi: any;
    };
    type: "read" | "write";
}

export function FunctionUI({ func, contractConfig, type }: FunctionUIProps) {
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [result, setResult] = useState<string>("");

    const { refetch, isLoading: isReading } = useReadContract({
        ...contractConfig,
        functionName: func.name,
        args: func.inputs.map((input: any) => inputs[input.name] || ""),
        query: { enabled: false }, // Sadece butona basıldığında çalışsın
    });

    const { writeContract, isPending: isWriting } = useWriteContract();

    const handleInputChange = (name: string, value: string) => {
        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    const executeRead = async () => {
        toast.info(`"${func.name}" fonksiyonu okunuyor...`);
        try {
            const { data: readData, isError, error } = await refetch();

            if (isError) throw error;

            let displayData;
            // Gelen veriyi okunabilir bir formata çevir
            if (typeof readData === "bigint") {
                displayData = readData.toString();
            } else if (
                Array.isArray(readData) ||
                typeof readData === "object"
            ) {
                displayData = JSON.stringify(
                    readData,
                    (key, value) =>
                        typeof value === "bigint" ? value.toString() : value,
                    2
                );
            } else {
                displayData = String(readData);
            }
            setResult(displayData);
            toast.success(`"${func.name}" başarıyla okundu!`);
        } catch (err: any) {
            setResult(`Hata: ${err.message}`);
            toast.error(`Okuma hatası: ${err.shortMessage || err.message}`);
        }
    };

    const executeWrite = () => {
        const args = func.inputs.map((input: any) => {
            const value = inputs[input.name];
            // uint256 ve ETH miktarı gibi büyük sayıları BigInt'e çevir
            if (input.type.includes("uint")) {
                try {
                    // Eğer kullanıcı 0.005 gibi bir değer girdiyse, bunu parseEther ile çevir
                    return value.includes(".")
                        ? parseEther(value)
                        : BigInt(value);
                } catch {
                    toast.error(`'${input.name}' için geçersiz sayı formatı.`);
                    return;
                }
            }
            return value;
        });

        const valueToSend =
            func.stateMutability === "payable"
                ? parseEther(inputs.value || "0")
                : undefined;

        toast.info(`"${func.name}" işlemi gönderiliyor...`);
        writeContract(
            {
                ...contractConfig,
                functionName: func.name,
                args: args,
                value: valueToSend,
            },
            {
                onSuccess: (hash) =>
                    toast.success(`İşlem başarıyla gönderildi! Hash: ${hash}`),
                onError: (error) => toast.error(`Hata: ${error.message}`),
            }
        );
    };

    return (
        <div className="p-4 border rounded-lg bg-card shadow-sm">
            <h3 className="font-mono font-semibold text-primary">
                {func.name}
                {func.stateMutability === "payable" && (
                    <span className="text-xs text-yellow-500 ml-2 bg-yellow-100 px-2 py-1 rounded">
                        PAYABLE
                    </span>
                )}
            </h3>
            <div className="my-3 space-y-2">
                {func.inputs.map((input: any, index: number) => (
                    <Input
                        key={input.name || index}
                        placeholder={`${input.name || `arg${index}`} (${
                            input.type
                        })`}
                        onChange={(e) =>
                            handleInputChange(
                                input.name || `arg${index}`,
                                e.target.value
                            )
                        }
                    />
                ))}
                {func.stateMutability === "payable" && (
                    <Input
                        placeholder="Gönderilecek ETH Miktarı (Örn: 0.005)"
                        onChange={(e) =>
                            handleInputChange("value", e.target.value)
                        }
                    />
                )}
            </div>
            <Button
                onClick={type === "read" ? executeRead : executeWrite}
                disabled={isReading || isWriting}
            >
                {isReading
                    ? "Okunuyor..."
                    : isWriting
                    ? "Gönderiliyor..."
                    : "Çalıştır"}
            </Button>
            {result && (
                <pre className="mt-4 p-2 bg-muted rounded-md text-sm whitespace-pre-wrap break-all">
                    <code className="text-muted-foreground">{result}</code>
                </pre>
            )}
        </div>
    );
}

