<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.scss';

  interface CalendarItem {
    id: string;
    name: string;
    wykonawca: string;
    data: string;
    godzinaRozp: string;
    godzinaZak: string;
    opis: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }

  let items: CalendarItem[] = [];
  let loading = true;
  let errorMessage: string | null = null;

  let loginModal = true;
  let email = '';
  let password = '';
  let authToken: string | null = null;
  let loggedInUser: User | null = null;

  let newName = '';
  let newWykonawca = '';
  let newDate = new Date().toISOString().substring(0, 10);
  let newStart = '09:00';
  let newEnd = '10:00';
  let newOpis = '';

  const GET_CALENDAR_ITEMS = `
    query GetCalendarItems {
      calendarItems {
        id
        name
        wykonawca
        data
        godzinaRozp
        godzinaZak
        opis
      }
    }
  `;

  const ADD_ITEM_MUTATION = `
    mutation AddItem(
      $name: String!,
      $wykonawca: String!,
      $data: String!,
      $godzinaRozp: String!,
      $godzinaZak: String!,
      $opis: String
    ) {
      addItem(
        name: $name,
        wykonawca: $wykonawca,
        data: $data,
        godzinaRozp: $godzinaRozp,
        godzinaZak: $godzinaZak,
        opis: $opis
      ) {
        id
        name
        wykonawca
        data
        godzinaRozp
        godzinaZak
        opis
      }
    }
  `;
    const DELETE_ITEM_MUTATION = `
      mutation DeleteService($id: ID!) {
    deleteService(id: $id)
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

  async function fetchItems() {
    loading = true;
    errorMessage = null;
    const data = await graphQLFetch(GET_CALENDAR_ITEMS);
    if (data) items = data.calendarItems;
    loading = false;
  }

  async function handleSubmit() {
    if (!newName || !newDate) return alert('Nazwa i data są wymagane');
    const variables = {
      name: newName,
      wykonawca: newWykonawca,
      data: newDate,
      godzinaRozp: newStart,
      godzinaZak: newEnd,
      opis: newOpis
    };
    const data = await graphQLFetch(ADD_ITEM_MUTATION, variables);
    if (data?.addItem) {
      newName = '';
      newWykonawca = '';
      newOpis = '';
      await fetchItems();
    }
  }

  async function deleteService(id: string) {
  const confirmed = confirm('Are you sure you want to delete this service?');
  if (!confirmed) return;

  const data = await graphQLFetch(DELETE_ITEM_MUTATION, { id });

  if (data?.deleteService) {
    items = items.filter(item => item.id !== id);
  }
}

  async function handleLogin() {
    if (!email || !password) return alert('Email i hasło są wymagane');
    const variables = { email, password };
    const data = await graphQLFetch(LOGIN_MUTATION, variables);
    if (data?.login) {
      authToken = data.login.token;
      loggedInUser = data.login.user;
      localStorage.setItem('authToken', JSON.stringify(authToken));
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      loginModal = false;
      await fetchItems();
    } else {
      alert('Nieprawidłowe dane logowania');
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  onMount(async () => {
  const savedToken = localStorage.getItem('authToken');
  const savedUser = localStorage.getItem('user');

  if (savedToken !== null && savedUser !== null) {
    authToken = savedToken;
    loggedInUser = JSON.parse(savedUser);
    loginModal = false;

    console.log("Token przywrócony z localStorage:", authToken);
    await fetchItems();
  } else {
    loginModal = true;
  }
  });
function logout() {
  authToken = null;
  loggedInUser = null;
  loginModal = true;
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}
</script>

{#if loginModal}
  <div class="login-modal">
    <div class="login-card">
      <h2>Logowanie</h2>
      <input type="email" placeholder="Email" bind:value={email} />
      <input type="password" placeholder="Hasło" bind:value={password} />
      <button on:click={handleLogin}>Zaloguj</button>
    </div>
  </div>
{/if}

<div class="app-container">
  <div class="main-content">
    {#if !loginModal}
      <button class="logout-btn" on:click={logout}>Log out</button>
    {/if}
    <h1 class="page-title">Service Planner</h1>
    {#if !loginModal}
      <div class="form-card">
        <h2 class="form-title">Dodaj nową usługę</h2>
        <form on:submit|preventDefault={handleSubmit} class="form-grid">
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
            <span>Godzina rozpoczęcia</span>
            <input type="time" bind:value={newStart} />
          </label>
          <label>
            <span>Godzina zakończenia</span>
            <input type="time" bind:value={newEnd} />
          </label>
          <label>
            <span>Opis</span>
            <textarea bind:value={newOpis}></textarea>
          </label>
          <button type="submit" disabled={loading}>{loading ? 'Dodawanie...' : 'Dodaj usługę'}</button>
        </form>
      </div>

      <h2 class="list-title">Lista usług</h2>

      {#if errorMessage}
        <p class="error-message">
          Błąd: {errorMessage}
          <button on:click={fetchItems}>Odśwież</button>
        </p>
      {:else if loading && items.length === 0}
        <div>Wczytywanie usług...</div>
      {:else if items.length === 0}
        <div>Brak zaplanowanych usług.</div>
      {:else}
        <div class="item-list">
          {#each items.sort((a,b) => new Date(a.data).getTime() - new Date(b.data).getTime()) as item (item.id)}
            <div class="calendar-item">
              <h3>{item.name}</h3>
              <p><b>Wykonawca:</b> {item.wykonawca}</p>

              <!-- TODO - FIX THE DATE FORMAT (resolver too) -->

              <p><b>Data:</b> {formatDate(item.data)}</p>
              <p><b>Czas:</b> {item.godzinaRozp} - {item.godzinaZak}</p>
              {#if item.opis}
                <p><b>Opis:</b> {item.opis}</p>
              {/if}
              <button class="delete-btn" on:click={() => deleteService(item.id)}>
                Usuń
              </button>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>
