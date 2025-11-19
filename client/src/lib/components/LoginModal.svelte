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

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isRegistering) handleRegister();
      else handleLogin();
    }
  }
</script>

<div class="overlay">
  <div class="login-card">
    <h2>{isRegistering ? 'Rejestracja' : 'Logowanie'}</h2>

    {#if isRegistering}
      <input
        type="text"
        placeholder="Imię i nazwisko"
        bind:value={name}
        oninput={(e) => setName(e.currentTarget.value)}
      />
    {/if}

    <input
      type="email"
      placeholder="Email"
      bind:value={email}
      oninput={(e) => setEmail(e.currentTarget.value)}
    />

    <input
      type="password"
      placeholder="Hasło"
      bind:value={password}
      oninput={(e) => setPassword(e.currentTarget.value)}
      onkeydown={handleKeyDown}
    />

    <button onclick={isRegistering ? handleRegister : handleLogin}>
      {isRegistering ? 'Zarejestruj' : 'Zaloguj'}
    </button>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <p class="switch-mode" onclick={toggleMode}>
      {isRegistering ? 'Masz już konto? Zaloguj się' : 'Nie masz konta? Zarejestruj się'}
    </p>
    <h2>Logowanie</h2>
    <input type="email" placeholder="Email" bind:value={email} />
    <input type="password" placeholder="Hasło" bind:value={password} />
    <button onclick={handleLogin}>Zaloguj</button>
  </div>
</div>