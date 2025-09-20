"use client";

import Image from "next/image";

// Component'in alacağı props'ların tipini tanımlıyoruz
interface BalanceDisplayProps {
    icon: string;
    name: string;
    amount?: string; // Wagmi'den gelen formatlanmış string
    isLoading: boolean;
    display?: string; // Optional pre-formatted display string (takes precedence)
    tooltip?: string; // Optional title/hover text
}

export function BalanceDisplay({
    icon,
    name,
    amount,
    isLoading,
    display,
    tooltip,
}: BalanceDisplayProps) {
    return (
        <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg w-32" title={isLoading ? undefined : tooltip}>
            <Image src={icon} alt={name} width={32} height={32} />
            <div className="flex flex-col">
                <span className="text-sm text-gray-300">{name}</span>
                <span className="text-lg font-bold text-gray-200">
                    {isLoading
                        ? "..."
                        : (typeof display === 'string' && display.length > 0)
                        ? display
                        : amount
                        ? parseFloat(amount).toFixed(4)
                        : "0.00"}
                </span>
            </div>
        </div>
    );
}
