import Image from 'next/image';

// Bakiye verisi için bir tip tanımı
export type Balance = {
  icon: string;
  amount: number;
  name: string;
};

export function BalanceDisplay({ balance }: { balance: Balance }) {
  return (
    <div className="bg-gray-800 bg-opacity-75 text-white p-2 rounded-md flex items-center gap-2 w-28 md:w-32 text-xs md:text-base">
      <div className="relative w-5 h-5 md:w-[30px] md:h-[30px]">
        <Image
          src={balance.icon}
          alt={balance.name}
          fill
          className="object-contain"
          sizes="(min-width: 768px) 30px, 20px"
        />
      </div>
      <span className="font-bold text-xs md:text-base flex-grow text-center leading-none">{balance.amount}</span>
    </div>
  );
}
