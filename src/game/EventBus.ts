// SSR-safe lightweight EventBus that works in both Node (SSR) and browser.
// Avoid importing Phaser here to prevent `window is not defined` during SSR.
import { EventEmitter } from 'events';

export const EventBus = new EventEmitter();
