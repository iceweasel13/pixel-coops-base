"use client";

import { useAccount, useReadContract } from "wagmi";

// Define props for this component
interface AdminGuardProps {
    children: React.ReactNode;
    contractConfig: {
        address: `0x${string}`;
        abi: any;
    };
}

export function AdminGuard({ children, contractConfig }: AdminGuardProps) {
    const { address: connectedAddress, isConnected } = useAccount();

    // Read contract 'owner' to get the owner's address
    const {
        data: ownerAddress,
        isLoading,
        error,
    } = useReadContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: "owner",
    });

    if (isLoading) {
        return (
            <div className="p-10 text-center">
                Checking admin permissions...
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="p-10 text-center">Please connect your wallet.</div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center text-destructive">
                <h2 className="text-2xl font-bold">Contract Read Error</h2>
                <p className="mt-2 text-sm">{error.message}</p>
            </div>
        );
    }

    if (ownerAddress !== connectedAddress) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold text-destructive">
                    Access Denied
                </h2>
                <p className="mt-2">
                    Only the contract owner can view this page.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    Connected Address: {connectedAddress}
                </p>
            </div>
        );
    }

    // If all checks pass, render children
    return <>{children}</>;
}
