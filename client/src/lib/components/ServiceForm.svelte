<script lang="ts">
  export let loading: boolean;
  export let handleSubmit: () => Promise<void>;

  export let newName: string;
  export let newWykonawca: string;
  export let newDate: string;
  export let newStart: string;
  export let newEnd: string;
  export let newOpis: string;

  export let setName: (v: string) => void;
  export let setWykonawca: (v: string) => void;
  export let setDate: (v: string) => void;
  export let setStart: (v: string) => void;
  export let setEnd: (v: string) => void;
  export let setOpis: (v: string) => void;

  // 🔹 Nowy prop — mówi, że formularz jest wywoływany dla konkretnego dnia
  export let fixedDate: string | null = null;
</script>

<section class="form-section">
  <h2>Dodaj usługę</h2>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="grid">
      <label>
        <span>Nazwa</span>
        <input
          type="text"
          bind:value={newName}
          required
          on:input={(e) => setName(e.currentTarget.value)}
        />
      </label>

      <label>
        <span>Wykonawca</span>
        <input
          type="text"
          bind:value={newWykonawca}
          on:input={(e) => setWykonawca(e.currentTarget.value)}
        />
      </label>

      <!-- 🔹 Jeśli mamy fixedDate, ukrywamy pole daty -->
      {#if !fixedDate}
        <label>
          <span>Data</span>
          <input
            type="date"
            bind:value={newDate}
            required
            on:input={(e) => setDate(e.currentTarget.value)}
          />
        </label>
      {:else}
        <!-- 🔹 Jeśli jest stała data, przypisujemy ją i nie pokazujemy pola -->
        <input type="hidden" value={fixedDate} />
      {/if}

      <label>
        <span>Od</span>
        <input
          type="time"
          bind:value={newStart}
          on:input={(e) => setStart(e.currentTarget.value)}
        />
      </label>

      <label>
        <span>Do</span>
        <input
          type="time"
          bind:value={newEnd}
          on:input={(e) => setEnd(e.currentTarget.value)}
        />
      </label>
    </div>

    <label class="full">
      <span>Opis</span>
      <textarea
        bind:value={newOpis}
        on:input={(e) => setOpis(e.currentTarget.value)}
      ></textarea>
    </label>

    <button type="submit" disabled={loading}>
      {loading ? 'Przetwarzanie...' : 'Dodaj usługę'}
    </button>
  </form>
</section>
