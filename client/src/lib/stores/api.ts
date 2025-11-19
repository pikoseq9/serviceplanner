import { authToken } from './stores';
import { get } from 'svelte/store';

const API_URL = 'http://localhost:4000/';

export async function graphQLFetch(query: string, variables: Record<string, any> = {}) {
  try {
    const token = get(authToken);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ query, variables })
    });

    const json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);

    return json.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
