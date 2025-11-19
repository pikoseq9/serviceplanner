import { redirect } from '@sveltejs/kit';

export const ssr = false;

export function load() {
  const token = localStorage.getItem('authToken');

  if (token) {
    throw redirect(302, '/app');
  }

  throw redirect(302, '/auth');
}