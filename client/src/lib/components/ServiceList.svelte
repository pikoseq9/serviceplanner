<script lang="ts">
  import type { CalendarItem } from './types';

  export let items: CalendarItem[];
  export let loading: boolean;
  export let errorMessage: string | null;
  export let deleteService: (id: string) => Promise<void>;
  export let formatDate: (date: string) => string;
</script>

<section class="list-section">
  <h2>Lista usług</h2>
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {:else if loading && items.length === 0}
    <p>Wczytywanie...</p>
  {:else if items.length === 0}
    <p>Brak zaplanowanych usług.</p>
  {:else}
    <div class="item-list">
      {#each items.sort((a,b) => new Date(a.data).getTime() - new Date(b.data).getTime()) as item (item.id)}
        <div class="item-card">
          <div class="item-header">
            <h3>{item.name}</h3>
            <button class="delete" on:click={() => deleteService(item.id)}>✕</button>
          </div>
          <p><b>Wykonawca:</b> {item.wykonawca || '—'}</p>
          <p><b>Data:</b> {formatDate(item.data)}</p>
          <p><b>Godziny:</b> {item.godzinaRozp}–{item.godzinaZak}</p>
          {#if item.opis}
            <p><b>Opis:</b> {item.opis}</p>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</section>
