<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authToken, loggedInUser } from '$lib/stores/stores';
  import { get } from 'svelte/store';
  import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';

  let darkMode = false;

  function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark', darkMode);
  }

  onMount(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (!token || !user) goto('/auth');

    authToken.set(token);
    loggedInUser.set(JSON.parse(user));
  });

  function logout() {
    localStorage.clear();
    authToken.set(null);
    loggedInUser.set(null);
    goto('/auth');
  }
</script>

<header>
  <h1>Service Planner</h1>

  <div class="right">
    <DarkModeToggle darkMode {toggleDarkMode}/>
    <span>{$loggedInUser?.name}</span>
    <button on:click={logout}>Wyloguj</button>
  </div>
</header>

<slot />
