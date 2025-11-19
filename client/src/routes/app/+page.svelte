<script lang="ts">
  import '$lib/app.scss'
  import { graphQLFetch } from '$lib/stores/api';
  import { onMount } from 'svelte';
  import Calendar from '$lib/components/Calendar.svelte';
  import ServiceForm from '$lib/components/ServiceForm.svelte';
  import type { CalendarItem } from '$lib/stores/types';
  import { goto } from '$app/navigation';

  let items: CalendarItem[] = [];
  let loading = false;

  // formularz
  let name = '';
  let wykonawca = '';
  let dateTemp = new Date();
  let date = dateTemp.toISOString().split('T')[0];
  let start = '09:00';
  let end = '10:00';
  let opis = '';

  const GET_ITEMS = `
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

  const ADD_ITEM = `
    mutation AddItem(
      $name: String!,
      $wykonawca: String!,
      $data: String!,
      $godzinaRozp: String!,
      $godzinaZak: String!,
      $opis: String!
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

  async function loadItems() {
    loading = true;
    items = (await graphQLFetch(GET_ITEMS)).calendarItems;
    loading = false;
  }

  async function addItem() {
    await graphQLFetch(ADD_ITEM, {
      name, wykonawca, data: date, godzinaRozp: start, godzinaZak: end, opis
    });

    await loadItems();
    name = wykonawca = opis = '';
  }

  onMount(loadItems);
</script>

<ServiceForm
  bind:newName={name}
  bind:newWykonawca={wykonawca}
  bind:newDate={date}
  bind:newStart={start}
  bind:newEnd={end}
  bind:newOpis={opis}
  {loading}
  handleSubmit={addItem}
/>

<Calendar
  {items}
  onSelectDate={(d) => goto(`/day/${d}`)}
/>
