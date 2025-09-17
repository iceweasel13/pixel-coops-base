import ChickenFarmABI from './abi/ChickenFarmABI.json';
import EggCoinABI from './abi/EggCoinABI.json';

export const chickenFarmContract = {
  address: process.env.NEXT_PUBLIC_MAIN_CONTRACT as `0x${string}`,
  abi: ChickenFarmABI,
};

export const eggTokenContract = {
  address: process.env.NEXT_PUBLIC_EGG_TOKEN_CONTRACT as `0x${string}`,
  abi: EggCoinABI,
};
