<script lang="ts">
  import type { User } from './types';

  export let email: string;
  export let password: string;
  export let handleLogin: () => Promise<void>;
  export let setEmail: (val: string) => void;
  export let setPassword: (val: string) => void;
</script>

<div class="overlay">
  <div class="login-card">
    <h2>Logowanie</h2>
    <input type="email" placeholder="Email" bind:value={email} on:input={(e) => setEmail(e.currentTarget.value)} />
    <input type="password" placeholder="Hasło" bind:value={password} on:input={(e) => setPassword(e.currentTarget.value)} />
    <button on:click={handleLogin}>Zaloguj</button>
  </div>
</div>
