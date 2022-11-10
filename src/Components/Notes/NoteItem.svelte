<script>
    import { createEventDispatcher } from 'svelte';
  import { selectedNote } from "../../stores/notes";
  export let id;
  export let status;
  export let domain;
  export let title;
	const dispatch = createEventDispatcher();
  function forward() {
    console.log(id)
    dispatch('selected', {id:id});
  }
</script>

<div class={`note`} on:click{forward}>
  <div class="note-meta">
    <span class="note-title">{title}</span>
    <span class="note-domain">{domain}</span>
  </div>
  <span class={`status status--${status}`} />
</div>

<style>
  .note {
    min-height: 3rem;
    display: flex;
    border-radius: 2px;
    padding: 0 1rem;
    cursor: pointer;
    margin-bottom: 0.5rem;
  }
  .note:hover {
    background-color: var(--primary-500);
    color: var(--background);
  }
  .note-meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
  }

  .note-domain {
    font-size: 0.8rem;
    opacity: 0.67;
  }
  .status {
    flex: 0 0 1rem;
    height: 1rem;
    margin-top: 1rem;
    border-radius: 50%;
  }
  .active {
    background-color: var(--primary-500);
    color: var(--background);
  }

  .status.status--draft {
    background-color: var(--secondary-500);
  }
  .status.status--archived {
    background-color: var(--grey-500);
  }
  .status.status--published {
    background-color: var(--success-500);
  }
</style>
