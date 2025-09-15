import ChickenFarmABI from './abi/ChickenFarmABI.json';
import EggcoinABI from './abi/EggcoinABI.json';

export const chickenFarmContract = {
  address: process.env.NEXT_PUBLIC_MAIN_CONTRACT as `0x${string}`,
  abi: ChickenFarmABI,
};

export const eggTokenContract = {
  address: process.env.NEXT_PUBLIC_EGG_TOKEN_CONTRACT as `0x${string}`,
  abi: EggcoinABI,
};