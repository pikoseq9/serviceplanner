<script lang="ts">
  import '$lib/app.scss'
  import { goto } from '$app/navigation';
  import { authToken, loggedInUser } from '$lib/stores/stores';
  import { graphQLFetch } from '$lib/stores/api';
  import LoginModal from '$lib/components/LoginModal.svelte';
  import { get } from 'svelte/store';

  let email = '';
  let password = '';

  const token = get(authToken);
  const user = get(loggedInUser);

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

  async function handleLogin() {
  if (!email || !password) return alert('Email i hasło są wymagane.');
  
  const data = await graphQLFetch(LOGIN_MUTATION, { email, password });
  
  if (data?.login) {
    // zapis tokenu do store
    authToken.set(data.login.token);

    // zapis usera do store
    loggedInUser.set(data.login.user);

    // dopiero teraz możesz zsynchronizować Storage
    localStorage.setItem('authToken', data.login.token);
    localStorage.setItem('user', JSON.stringify(data.login.user));

    goto('/');
  } else {
    alert('Nieprawidłowe dane logowania.');
  }
}
</script>

<div>
  <LoginModal
  bind:email={email}
  bind:password={password}
  {handleLogin}
  />
</div>
