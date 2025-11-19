<script lang="ts">
  import Page from "../../routes/auth/+page.svelte";

  export let email: string;
  export let password: string;
  export let name: string;
  export let isRegistering: boolean;
  export let handleLogin: () => Promise<void>;
  export let handleRegister: () => Promise<void>;
  export let setEmail: (val: string) => void;
  export let setPassword: (val: string) => void;
  export let setName: (val: string) => void;

  isRegistering = false;

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isRegistering) handleRegister();
      else handleLogin();
    }
  }

  const toggleMode = () => {
    isRegistering = !isRegistering;
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
        onkeydown={handleKeyDown}
      />
    {/if}

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <input type="email" placeholder="Email" bind:value={email} />
    <input type="password" placeholder="Hasło" bind:value={password} />
    <button onclick={isRegistering ? handleRegister : handleLogin}>
      {isRegistering ? 'Zarejestruj' : 'Zaloguj'}
    </button>
        <p class="switch-mode" onclick={toggleMode}>
      {isRegistering ? 'Masz już konto? Zaloguj się' : 'Nie masz konta? Zarejestruj się'}
    </p>
  </div>
</div>