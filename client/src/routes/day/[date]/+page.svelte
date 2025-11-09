<script lang="ts">
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import ServiceList from '$lib/components/ServiceList.svelte';
  import type { CalendarItem } from '$lib/components/types';

  let items: CalendarItem[] = [];
  let loading = true;
  let errorMessage: string | null = null;
  const token = localStorage.getItem('authToken');
  // Pobieramy datę z URL, np. "2025-11-08"
  const { date } = get(page).params;

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  async function deleteService(id: string) {
    try {
      const res = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
        body: JSON.stringify({
          query: `mutation($id: ID!) { deleteService(id: $id) }`,
          variables: { id },
        }),
      });
      const data = await res.json();
      if (data.errors) throw new Error(data.errors[0].message);
      items = items.filter((i) => i.id !== id);
    } catch (err: any) {
      errorMessage = err.message;
    }
  }

  onMount(async () => {
    try {
      const res = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              calendarItems {
                id
                name
                wykonawca
                data
                godzinaRozp
                godzinaZak
                opis
                createdBy { name }
              }
            }
          `,
        }),
      });

      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0].message);

      // 🔥 Tu porównujemy daty dokładnie po stringu, bez żadnych konwersji
      items = json.data.calendarItems.filter(
        (item: CalendarItem) => item.data === date
      );
    } catch (err: any) {
      errorMessage = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<div class="day-content">
    <ServiceList
  {items}
  {loading}
  {errorMessage}
  {deleteService}
  {formatDate}
/>

</div>

