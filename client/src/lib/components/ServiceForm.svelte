<script lang="ts">
  export let loading: boolean;
  export let handleSubmit: () => Promise<void>;

  export let newName: string;
  export let newWykonawca: string;
  export let newDate: string;
  export let newStart: string;
  export let newEnd: string;
  export let newOpis: string;
</script>

<section class="form-section">
  <h2>Dodaj usługę</h2>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="grid">
      <label>
        <span>Nazwa</span>
        <input type="text" bind:value={newName} required />
      </label>
      <label>
        <span>Wykonawca</span>
        <input type="text" bind:value={newWykonawca} />
      </label>
      <label>
        <span>Data</span>
        <input type="date" bind:value={newDate} required />
      </label>
      <label>
        <span>Od</span>
        <input type="time" bind:value={newStart} />
      </label>
      <label>
        <span>Do</span>
        <input type="time" bind:value={newEnd} />
      </label>
    </div>

    <label class="full">
      <span>Opis</span>
      <textarea bind:value={newOpis}></textarea>
    </label>

    <button type="submit" disabled={loading}>
      {loading ? 'Przetwarzanie...' : 'Dodaj usługę'}
    </button>
  </form>
</section>
