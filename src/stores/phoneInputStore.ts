import { writable } from 'svelte/store';

const digitCount = 9;
export const fishCursorCaught = writable<null | number>();
export const phoneNumber = writable<(null | number)[]>(Array(digitCount).fill(null));