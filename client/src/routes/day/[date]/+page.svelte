<script lang="ts">
  import { graphQLFetch } from '$lib/stores/api.js';
  import { onMount } from 'svelte';
  import type { CalendarItem } from '$lib/stores/types.js';
  export let data;

  let items: CalendarItem[] = [];

  const GET_DAY = `
    query Day($date: String!) {
      itemsByDate(date:$date) {
        id name wykonawca data godzinaRozp godzinaZak opis
      }
    }
  `;

  onMount(async () => {
    const result = await graphQLFetch(GET_DAY, { date: data });
    items = result.itemsByDate;
  });
</script>

<h1>Dzień: {data}</h1>

{#if items.length === 0}
  <p>Brak usług tego dnia.</p>
{:else}
  <ul>
    {#each items as item}
      <li>{item.name} ({item.godzinaRozp}-{item.godzinaZak})</li>
    {/each}
  </ul>
{/if}
