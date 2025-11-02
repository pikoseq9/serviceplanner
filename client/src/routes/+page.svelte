<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.scss';
  import type { CalendarItem, User } from '$lib/components/types';
  import LoginModal from '$lib/components/LoginModal.svelte';
  import ServiceForm from '$lib/components/ServiceForm.svelte';
  import Calendar from '$lib/components/Calendar.svelte';
  import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';

  let items: CalendarItem[] = [];
  let loading = false;
  let errorMessage: string | null = null;

  let loginModal = true;
  let email = '';
  let password = '';
  let authToken: string | null = null;
  let loggedInUser: User | null = null;

  let darkMode = false;

  let newName = '';
  let newWykonawca = '';
  let newDate = new Date().toISOString().substring(0, 10);
  let newStart = '09:00';
  let newEnd = '10:00';
  let newOpis = '';

  const API_URL = 'http://localhost:4000/';

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
      if (result.errors) throw new Error(result.errors[0].message);
      return result.data;
    } catch (error) {
      console.error(error);
      errorMessage = (error as Error).message || 'Błąd komunikacji z serwerem.';
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
    if (!newName || !newDate) return alert('Nazwa i data są wymagane.');
    const variables = {
      name: newName,
      wykonawca: newWykonawca,
      data: newDate,
      godzinaRozp: newStart,
      godzinaZak: newEnd,
      opis: newOpis
    };
    loading = true;
    const data = await graphQLFetch(ADD_ITEM_MUTATION, variables);
    if (data?.addItem) {
      newName = newWykonawca = newOpis = '';
      await fetchItems();
    }
    loading = false;
  }

  async function deleteService(id: string) {
    if (!confirm('Czy na pewno chcesz usunąć tę usługę?')) return;
    const data = await graphQLFetch(DELETE_ITEM_MUTATION, { id });
    if (data?.deleteService) items = items.filter(i => i.id !== id);
  }

  async function handleLogin() {
    if (!email || !password) return alert('Email i hasło są wymagane.');
    const data = await graphQLFetch(LOGIN_MUTATION, { email, password });
    if (data?.login) {
      authToken = data.login.token;
      loggedInUser = data.login.user;
      if (authToken) {
        localStorage.setItem('authToken', authToken);
      }
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      loginModal = false;
      await fetchItems();
    } else {
      alert('Nieprawidłowe dane logowania.');
    }
  }

  function logout() {
    authToken = null;
    loggedInUser = null;
    loginModal = true;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark', darkMode);
  }

  onMount(async () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      authToken = token;
      loggedInUser = JSON.parse(user);
      loginModal = false;
      await fetchItems();
    }
  });
</script>

{#if loginModal}
  <LoginModal
    {email}
    {password}
    {handleLogin}
    setEmail={(v) => email = v}
    setPassword={(v) => password = v}
  />
{:else}
  <div class="container">
    <header>
      <h1>Service Planner</h1>
      <div class="user-info">
        <DarkModeToggle {darkMode} {toggleDarkMode} />
        <span>{loggedInUser?.name}</span>
        <button on:click={logout}>Wyloguj</button>
      </div>
    </header>

    <ServiceForm
      {loading}
      {handleSubmit}
      {newName} {newWykonawca} {newDate} {newStart} {newEnd} {newOpis}
      setName={(v) => newName = v}
      setWykonawca={(v) => newWykonawca = v}
      setDate={(v) => newDate = v}
      setStart={(v) => newStart = v}
      setEnd={(v) => newEnd = v}
      setOpis={(v) => newOpis = v}
    />

    {#if items.length === 0}
      <div>Brak zaplanowanych usług.</div>
    {:else}
      <Calendar {items} onSelectDate={(date) => newDate = date} />
    {/if}
  </div>
{/if}
