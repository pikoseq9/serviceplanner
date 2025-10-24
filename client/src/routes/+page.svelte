<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.scss';

  // --- Typy ---
  interface CalendarItem {
    id: string;
    title: string;
    date: string;
    durationMinutes: number;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }

  // --- Stan aplikacji ---
  let items: CalendarItem[] = [];
  let loading = true;
  let errorMessage: string | null = null;

  let loginModal = true;
  let email = '';
  let password = '';
  let authToken: string | null = null;
  let loggedInUser: User | null = null;

  let newItemTitle = '';
  let newItemDate = new Date().toISOString().substring(0, 10);
  let newItemDuration = 60;

  // --- GraphQL ---
  const GET_CALENDAR_ITEMS = `
    query GetCalendarItems {
      calendarItems {
        id
        title
        date
        durationMinutes
      }
    }
  `;

  const ADD_ITEM_MUTATION = `
    mutation AddItem($title: String!, $date: String!, $durationMinutes: Int!) {
      addItem(title: $title, date: $date, durationMinutes: $durationMinutes) {
        id
        title
        date
        durationMinutes
      }
    }
  `;

  const LOGIN_MUTATION = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          id
          email
          name
          role
        }
      }
    }
  `;

  // --- GraphQL Fetch ---
  async function graphQLFetch(query: string, variables: Record<string, any> = {}) {
    const API_URL = 'http://localhost:4000/';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL Errors:', result.errors);
        throw new Error(result.errors[0].message || 'GraphQL error');
      }

      return result.data;
    } catch (error) {
      console.error('Fetch error:', error);
      errorMessage = (error as Error).message || 'Failed to communicate with the server.';
      return null;
    }
  }

  // --- Funkcje ---
  async function fetchItems() {
    loading = true;
    errorMessage = null;
    const data = await graphQLFetch(GET_CALENDAR_ITEMS);
    if (data) items = data.calendarItems;
    loading = false;
  }

  async function handleSubmit() {
    if (!newItemTitle || !newItemDate) return alert('Title and Date required');
    const variables = {
      title: newItemTitle,
      date: newItemDate,
      durationMinutes: parseInt(newItemDuration.toString(), 10),
    };
    const data = await graphQLFetch(ADD_ITEM_MUTATION, variables);
    if (data?.addItem) {
      newItemTitle = '';
      newItemDuration = 60;
      await fetchItems();
    }
  }

  async function handleLogin() {
    if (!email || !password) return alert('Email and password required');
    const variables = { email, password };
    const data = await graphQLFetch(LOGIN_MUTATION, variables);
    if (data?.login) {
      authToken = data.login.token;
      loggedInUser = data.login.user;
      loginModal = false;
      await fetchItems();
    } else {
      alert('Invalid credentials');
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  onMount(() => {
    if (!authToken) loginModal = true;
    else fetchItems();
  });
</script>

<svelte:head>
  <title>Calendar Planner</title>
</svelte:head>

<!-- LOGIN MODAL -->
{#if loginModal}
  <div class="login-modal">
    <div class="login-card">
      <h2>Login</h2>
      <input type="email" placeholder="Email" bind:value={email} />
      <input type="password" placeholder="Password" bind:value={password} />
      <button on:click={handleLogin}>Log In</button>
    </div>
  </div>
{/if}

<div class="app-container">
  <div class="main-content">
    <h1 class="page-title">🗓️ Full-Stack Calendar Planner</h1>

    {#if !loginModal}
      <!-- FORM -->
      <div class="form-card">
        <h2 class="form-title">Add New Calendar Item</h2>
        <form on:submit|preventDefault={handleSubmit} class="form-grid">
          <label class="form-label-container">
            <span class="form-label">Title</span>
            <input type="text" bind:value={newItemTitle} required class="form-input" />
          </label>

          <label class="form-label-container">
            <span class="form-label">Date</span>
            <input type="date" bind:value={newItemDate} required class="form-input" />
          </label>

          <label class="form-label-container">
            <span class="form-label">Duration (min)</span>
            <input type="number" bind:value={newItemDuration} min="1" max="480" class="form-input" />
          </label>

          <button type="submit" disabled={loading} class="submit-button">
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      </div>

      <!-- CALENDAR ITEMS -->
      <h2 class="list-title">Scheduled Events</h2>

      {#if errorMessage}
        <p class="error-message">
          Error: {errorMessage} <button on:click={fetchItems} class="reload-button">Try Reloading</button>
        </p>
      {:else if loading && items.length === 0}
        <div class="loading-state">Loading calendar items...</div>
      {:else if items.length === 0}
        <div class="empty-state">No events scheduled. Use the form above to add your first item!</div>
      {:else}
        <div class="item-list">
          {#each items.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) as item (item.id)}
            <div class="calendar-item">
              <div class="item-date-box">
                {formatDate(item.date).split(' ')[1]} {formatDate(item.date).split(' ')[2]}
              </div>
              <div class="item-details">
                <h3 class="item-title">{item.title}</h3>
                <p class="item-meta">{formatDate(item.date)} &bull; {item.durationMinutes} minutes</p>
              </div>
              <div class="item-id">ID: {item.id}</div>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>
