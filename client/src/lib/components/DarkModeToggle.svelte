<script lang="ts">
  export let darkMode: boolean;
  export let toggleDarkMode: () => void;
</script>

<button class="dark-toggle" on:click={toggleDarkMode}>
  {darkMode ? '🌙 Tryb ciemny' : '☀️ Tryb jasny'}
</button>
