<script lang="ts">
  import type { User } from './types';

  export let email: string;
  export let password: string;
  export let handleLogin: () => Promise<void>;
</script>

<div class="overlay">
  <div class="login-card">
    <h2>Logowanie</h2>
    <input type="email" placeholder="Email" bind:value={email} />
    <input type="password" placeholder="Hasło" bind:value={password} />
    <button onclick={handleLogin}>Zaloguj</button>
  </div>
</div>
