/**
 * @file chickens.ts
 * @description Central repository for all static chicken data.
 * This provides a single source of truth for chicken attributes like names, images, and stats.
 */
import { supabase } from '@/utils/supabase';

export const fetchPurchasableChickens = async () => {
    const { data: chickens, error } = await supabase
        .from('chickens')
        .select('*')
        .gt('id', 1) // Sadece id'si 1'den büyük olanları getir
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching purchasable chickens:', error);
        return [];
    }

    return chickens;
};

export const getChickenDataMap = async () => {
    const allChickens = await fetchPurchasableChickens();
    return new Map(allChickens.map(chicken => [chicken.id, chicken]));
};