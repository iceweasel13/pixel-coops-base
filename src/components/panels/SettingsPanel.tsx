// Konum: src/components/panels/SettingsPanel.tsx

"use client";

import { useEffect, useState } from "react";
import { EventBus } from "@/game/EventBus";
import { Slider } from "@/components/ui/slider";

export function SettingsPanel() {
    const [volume, setVolume] = useState<number>(30);

    useEffect(() => {
        try {
            const savedVol = window.localStorage.getItem("soundVolume");
            if (savedVol !== null) setVolume(Math.max(0, Math.min(100, parseInt(savedVol))));
            else {
                const enabled = window.localStorage.getItem("soundEnabled");
                if (enabled !== null) setVolume(enabled === "true" ? 30 : 0);
            }
        } catch {}
    }, []);

    useEffect(() => {
        const vol = Math.max(0, Math.min(100, volume));
        try {
            window.localStorage.setItem("soundVolume", String(vol));
            window.localStorage.setItem("soundEnabled", String(vol > 0));
        } catch {}
        EventBus.emit("set-sound-volume", vol / 100);
    }, [volume]);

    return (
        <div className="text-center text-white px-4 py-6 sm:p-8">
            <div className="mx-auto flex max-w-sm flex-col items-stretch justify-between gap-4 rounded-lg bg-black/30 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                <div className="flex-1 text-left">
                    <div className="text-lg text-gray-300 sm:text-xl">Sound</div>
                    <div className="text-xs text-gray-400 sm:text-sm">Volume: {volume}%</div>
                </div>
                <div className="w-full sm:w-56 sm:max-w-[60%]">
                    <Slider
                        value={[volume]}
                        onValueChange={(v: number[]) => setVolume(v[0] ?? 0)}
                        max={100}
                        step={1}
                    />
                </div>
            </div>
        </div>
    );
}
