import Image from 'next/image';

// Bakiye verisi için bir tip tanımı
export type Balance = {
  icon: string;
  amount: number;
  name: string;
};

export function BalanceDisplay({ balance }: { balance: Balance }) {
  return (
    <div className="bg-gray-800 bg-opacity-75 text-white p-2 rounded-md flex items-center gap-2 w-32">
      <Image src={balance.icon} alt={balance.name} width={30} height={30} />
      <span className="font-bold text-lg flex-grow text-center">{balance.amount}</span>
    </div>
  );
}