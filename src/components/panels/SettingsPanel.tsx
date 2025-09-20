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
        <div className="text-center text-white p-8">
            <h2 className="text-3xl font-bold mb-6 text-[#a4e24d]">SETTINGS</h2>
            <div className="bg-black/30 p-6 rounded-lg flex items-center justify-between max-w-sm mx-auto">
                <div className="flex-1 mr-4 text-left">
                    <div className="text-xl text-gray-300">Sound</div>
                    <div className="text-sm text-gray-400">Volume: {volume}%</div>
                </div>
                <div className="w-56 max-w-[60%]">
                    <Slider value={[volume]} onValueChange={(v) => setVolume(v[0] ?? 0)} max={100} step={1} />
                </div>
            </div>
        </div>
    );
}
