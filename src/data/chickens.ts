/**
 * @file chickens.ts
 * @description Central repository for all static chicken data.
 * This provides a single source of truth for chicken attributes like names, images, and stats.
 */

// Special definition for the starter chicken. Its index on the contract is 1.
export const starterChickenData = { 
    id: 1, // This is the chickenIndex on the smart contract
    name: "Starter Chicken", 
    imageUrl: "/assets/chickens/chicken1.png", 
    power: 50, 
    stamina: 50, 
    cost: 0, 
};

// Array of all purchasable chickens in the shop.
// The `id` must match the `chickenIndex` on the smart contract.
export const purchasableChickens = [
    { id: 2, name: "Normal Chicken", imageUrl: "/assets/chickens/chicken2.png", power: 100, stamina: 100, cost: 80 },
    { id: 3, name: "Fast Chicken", imageUrl: "/assets/chickens/chicken3.png", power: 150, stamina: 150, cost: 130 },
    { id: 4, name: "Super Chicken", imageUrl: "/assets/chickens/chicken4.png", power: 220, stamina: 220, cost: 210 },
    { id: 5, name: "Golden Chicken", imageUrl: "/assets/chickens/chicken5.png", power: 300, stamina: 300, cost: 340 },
    { id: 6, name: "Robo-Chicken", imageUrl: "/assets/chickens/chicken6.png", power: 430, stamina: 430, cost: 550 },
    { id: 7, name: "Ninja Chicken", imageUrl: "/assets/chickens/chicken7.png", power: 600, stamina: 600, cost: 880 },
    { id: 8, name: "Dragon Chicken", imageUrl: "/assets/chickens/chicken8.png", power: 900, stamina: 900, cost: 1400 },
    { id: 9, name: "Cosmic Chicken", imageUrl: "/assets/chickens/chicken9.png", power: 1300, stamina: 1300, cost: 2200 },
    { id: 10, name: "God-Tier Chicken", imageUrl: "/assets/chickens/chicken10.png", power: 2000, stamina: 2000, cost: 3500 },
];

// Combine all chicken types into a single, easily searchable map.
const allChickens = [starterChickenData, ...purchasableChickens];
export const chickenDataMap = new Map(allChickens.map(chicken => [chicken.id, chicken]));