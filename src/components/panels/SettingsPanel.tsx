// Konum: src/components/panels/SettingsPanel.tsx

export function SettingsPanel() {
    return (
        <div className="text-center text-white p-8">
            <h2 className="text-3xl font-bold mb-6 text-[#a4e24d]">SETTINGS</h2>
            <div className="bg-black/30 p-6 rounded-lg flex items-center justify-between max-w-sm mx-auto">
                <label htmlFor="sound-toggle" className="text-xl text-gray-300">
                    Sound
                </label>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-linear rounded-full">
                    <input
                        type="checkbox"
                        id="sound-toggle"
                        name="sound-toggle"
                        className="absolute w-0 h-0 opacity-0"
                        defaultChecked
                    />
                    <label
                        htmlFor="sound-toggle"
                        className="block w-12 h-6 overflow-hidden bg-gray-600 rounded-full cursor-pointer"
                    ></label>
                    <label
                        htmlFor="sound-toggle"
                        className="absolute block w-4 h-4 mt-1 ml-1 transition-transform duration-200 ease-linear transform bg-white rounded-full cursor-pointer"
                    ></label>
                </div>
            </div>
            <style jsx>{`
                input:checked ~ label[for='sound-toggle']:last-of-type {
                    transform: translateX(1.5rem);
                }
                input:checked ~ label[for='sound-toggle']:first-of-type {
                    background-color: #a4e24d;
                }
            `}</style>
        </div>
    );
}