<script lang="ts">
  export let email: string;
  export let password: string;
  export let name: string;
  export let isRegistering: boolean;
  export let handleLogin: () => Promise<void>;
  export let handleRegister: () => Promise<void>;
  export let setEmail: (val: string) => void;
  export let setPassword: (val: string) => void;
  export let setName: (val: string) => void;
  export let toggleMode: () => void;
</script>

<div class="overlay">
  <div class="login-card">
    <h2>{isRegistering ? 'Rejestracja' : 'Logowanie'}</h2>

    {#if isRegistering}
      <input
        type="text"
        placeholder="Imię i nazwisko"
        bind:value={name}
        on:input={(e) => setName(e.currentTarget.value)}
      />
    {/if}

    <input
      type="email"
      placeholder="Email"
      bind:value={email}
      on:input={(e) => setEmail(e.currentTarget.value)}
    />

    <input
      type="password"
      placeholder="Hasło"
      bind:value={password}
      on:input={(e) => setPassword(e.currentTarget.value)}
    />

    <button on:click={isRegistering ? handleRegister : handleLogin}>
      {isRegistering ? 'Zarejestruj' : 'Zaloguj'}
    </button>

    <p class="switch-mode" on:click={toggleMode}>
      {isRegistering ? 'Masz już konto? Zaloguj się' : 'Nie masz konta? Zarejestruj się'}
    </p>
  </div>
</div>