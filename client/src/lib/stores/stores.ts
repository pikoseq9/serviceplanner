import { writable } from 'svelte/store';
import type { User } from './types';

export const authToken = writable<string | null>(null);
export const loggedInUser = writable<User | null>(null);
