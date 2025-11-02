<script lang="ts">
  import { onMount } from 'svelte';
  import type { CalendarItem } from '$lib/types';

  export let onSelectDate: (date: string) => void;
  export let items: CalendarItem[] = [];

  let currentDate = new Date();
  let days: Date[] = [];

  function generateCalendar(date: Date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysArray: Date[] = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArray.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    days = daysArray;
  }

  function formatDay(d: Date) {
    return d.toLocaleDateString('pl-PL', { day: '2-digit' });
  }

  function isToday(d: Date) {
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }

  function getItemsForDay(day: Date) {
    const isoDay = day.toLocaleDateString('sv-SE'); 
    return items.filter(item => item.data === isoDay);
  }

  function prevMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    generateCalendar(currentDate);
  }

  function nextMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    generateCalendar(currentDate);
  }

  onMount(() => generateCalendar(currentDate));
</script>

<div class="calendar-container">
  <div class="calendar-header">
    <button on:click={prevMonth}>‹</button>
    <h2>
      {currentDate.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
    </h2>
    <button on:click={nextMonth}>›</button>
  </div>

  <div class="calendar-grid">
    {#each days as day}
      <div
        class="calendar-day {isToday(day) ? 'today' : ''}"
        on:click={() => onSelectDate(day.toLocaleDateString('sv-SE'))}
      >
        <div class="day-number">{formatDay(day)}</div>
        {#each getItemsForDay(day) as item}
          <div class="calendar-event">
            <strong>{item.name}</strong>
            <small>{item.godzinaRozp} - {item.godzinaZak}</small>
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">

</style>
