import { supabase } from '@/utils/supabase';

export type FarmUpgrade = {
  level: number;
  maxChickens: number;
  totalProductionPower: number;
  cost: number; // in $EGG
  x: number;
  y: number;
};

export const fetchFarmUpgrades = async (): Promise<FarmUpgrade[]> => {
    const { data: upgrades, error } = await supabase
        .from('upgrades')
        .select('*')
        .order('level', { ascending: true });

    if (error) {
        console.error('Error fetching farm upgrades:', error);
        return [];
    }

    return upgrades;
};  