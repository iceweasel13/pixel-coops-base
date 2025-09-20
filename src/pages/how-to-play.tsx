import Head from 'next/head'
import Image from 'next/image'
import { starterChickenData, purchasableChickens } from '@/data/chickens'
import { farmUpgrades } from '@/data/upgrades'
import { useGame } from '@/context/GameContext'
import { useMemo } from 'react'

export default function HowToPlay() {
  const { playerFarm, playerData } = useGame();

  const chickens = useMemo(() => [starterChickenData, ...purchasableChickens], []);

  const formatCooldown = (secs: number) => {
    if (!secs || secs <= 0) return 'Ready now';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>How to Play</title>
        <meta name="description" content="Learn how to play the game: quick start, core loop, and tips." />
      </Head>

      <header className="border-b border-white/10 bg-black/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={36} height={36} className="rounded-sm" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">How to Play</h1>
            <p className="text-sm text-gray-300">Quick start guide, core mechanics, and useful tips</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Overview */}
        <section className="mb-10">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold mb-2">Overview</h2>
            <p className="text-gray-300 leading-relaxed">
              Build your farm, collect eggs, and optimize your production. Connect your wallet, purchase your first
              farm plot, and start collecting rewards as you expand your coop and manage your chickens.
            </p>
          </div>
        </section>

        {/* Quick Start Cards (docs-like) */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex gap-4">
              <div className="shrink-0">
                <div className="size-12 rounded-lg bg-white/10 grid place-items-center">
                  <Image src="/icons/ether.png" alt="Connect" width={24} height={24} />
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400">Step 1</div>
                <div className="font-medium">Connect Wallet</div>
                <p className="text-gray-300 text-sm mt-1">Use the Start screen to connect with your wallet provider.</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex gap-4">
              <div className="shrink-0">
                <div className="size-12 rounded-lg bg-white/10 grid place-items-center">
                  <Image src="/assets/coop.png" alt="Farm" width={24} height={24} />
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400">Step 2</div>
                <div className="font-medium">Purchase Farm Plot</div>
                <p className="text-gray-300 text-sm mt-1">Buy your first farm to begin production and unlock gameplay.</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex gap-4">
              <div className="shrink-0">
                <div className="size-12 rounded-lg bg-white/10 grid place-items-center">
                  <Image src="/assets/chickens/chicken3.png" alt="Collect" width={24} height={24} />
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400">Step 3</div>
                <div className="font-medium">Collect Eggs</div>
                <p className="text-gray-300 text-sm mt-1">Open the Collect menu to claim eggs generated over time.</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex gap-4">
              <div className="shrink-0">
                <div className="size-12 rounded-lg bg-white/10 grid place-items-center">
                  <Image src="/icons/egg.png" alt="Upgrade" width={24} height={24} />
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400">Step 4</div>
                <div className="font-medium">Upgrade & Expand</div>
                <p className="text-gray-300 text-sm mt-1">Use eggs to expand your coop and improve production rates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Chickens Table */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Chickens & Stats</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-300 bg-white/5">
                  <th className="px-4 py-3">Chicken</th>
                  <th className="px-4 py-3">Hashrate</th>
                  <th className="px-4 py-3">Stamina Req</th>
                  <th className="px-4 py-3">Cost ($EGG)</th>
                </tr>
              </thead>
              <tbody>
                {chickens.map((c) => (
                  <tr key={c.id} className="border-t border-white/10">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Image src={c.imageUrl} alt={c.name} width={64} height={64} className="rounded" />
                        <div className="font-medium">{c.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{c.power}</td>
                    <td className="px-4 py-3">{c.stamina}</td>
                    <td className="px-4 py-3">{c.cost}</td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Production is shared across all players based on hashrate and network emissions (with halving). Power increases your share.</p>
        </section>

        {/* Farm Upgrade Costs */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Farm Upgrades & Costs</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-300 bg-white/5">
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Max Chickens</th>
                  <th className="px-4 py-3">Farm Hashrate</th>
                  <th className="px-4 py-3">Cost ($EGG)</th>
                </tr>
              </thead>
              <tbody>
                {farmUpgrades.map(u => (
                  <tr key={u.level} className="border-t border-white/10">
                    <td className="px-4 py-3">{u.level}</td>
                    <td className="px-4 py-3">{u.maxChickens}</td>
                    <td className="px-4 py-3">{u.totalProductionPower}</td>
                    <td className="px-4 py-3">{u.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Upgrades increase capacity and base hashrate. Limit: 1 upgrade per cooldown period. Current cooldown: {formatCooldown(playerData?.farmUpgradeCooldown || 0)}</p>
        </section>

        {/* Limits & Rules */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Limits & Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-medium mb-1">Starter Chicken</div>
              <p className="text-gray-300 text-sm">One-time free claim per player to kickstart your farm.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-medium mb-1">Farm Upgrade Cooldown</div>
              <p className="text-gray-300 text-sm">Upgrade your farm capacity once per cooldown period. Günlük yükseltme sınırı: 1.</p>
              <p className="text-gray-400 text-xs mt-1">Next upgrade in: {formatCooldown(playerData?.farmUpgradeCooldown || 0)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-medium mb-1">Capacity & Stamina</div>
              <p className="text-gray-300 text-sm">Each chicken requires stamina capacity. You must have available power ≥ stamina to purchase.</p>
              {playerFarm && (
                <p className="text-gray-400 text-xs mt-1">Available power: {Number(playerFarm.totalProductionPower - playerFarm.currProductionPower)} | Max chickens: {playerFarm.maxChickens} | Owned: {playerFarm.currChickens}</p>
              )}
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-medium mb-1">Claims</div>
              <p className="text-gray-300 text-sm">Claim rewards anytime from the Collect menu. Unclaimed rewards accrue over time.</p>
            </div>
          </div>
        </section>

        {/* Core Loop */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-3">Core Gameplay Loop</h2>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <ol className="list-decimal pl-5 space-y-2 text-gray-300">
              <li>Generate resources over time based on your farm setup.</li>
              <li>Collect resources regularly to prevent overflow or inefficiency.</li>
              <li>Spend resources to upgrade chickens, coop slots, and capacity.</li>
              <li>Repeat and optimize for better yields and faster progression.</li>
            </ol>
          </div>
        </section>

        {/* Tips (cards similar to docs feature blocks) */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-medium">Claim Timing</div>
              <p className="text-gray-300 text-sm mt-2">Claim eggs at regular intervals to keep production efficient.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-medium">Balanced Upgrades</div>
              <p className="text-gray-300 text-sm mt-2">Balance coop slots and chicken upgrades for optimal growth.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-medium">Watch Announcements</div>
              <p className="text-gray-300 text-sm mt-2">Check in-game announcements for events and bonus windows.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-lg font-semibold mb-4">FAQ</h2>
          <div className="space-y-4">
            <details className="group rounded-xl border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <span className="font-medium">How do I start a new game?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="text-gray-300 text-sm mt-2">Open the game, connect your wallet, then purchase your first farm plot in the setup dialog.</p>
            </details>
            <details className="group rounded-xl border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <span className="font-medium">Where do I collect my eggs?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="text-gray-300 text-sm mt-2">Use the Collect menu in-game. You can claim periodically as production accrues.</p>
            </details>
            <details className="group rounded-xl border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <span className="font-medium">What should I upgrade first?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="text-gray-300 text-sm mt-2">Focus on early capacity and basic chicken upgrades to establish steady yield before expanding further.</p>
            </details>
          </div>
        </section>

        <footer className="text-gray-400 text-sm py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <span>Need help? Reach out via in-game announcements or socials.</span>
            <a href="/" className="text-[#a4e24d] hover:underline">Back to Home</a>
          </div>
        </footer>
      </main>
    </div>
  )
}
