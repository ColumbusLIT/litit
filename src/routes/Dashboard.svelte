<script>
  import DomainsList from "../components/Notes/DomainsList.svelte";
import NotesList from "../components/Notes/NotesList.svelte";
import NoteForm from "../components/Notes/NoteForm.svelte";
  import {
    hideLoadingOverlay,
    showLoadingOverlay,
  } from "../stores/loadingOverlayQueue.js";
  import { user } from "../stores/user.js";

  export let location;

  function clearForm() {
    
  }

</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

{#if $user && $user.username}
  <section class="account">
    <div class="account-header">
      <div>Notification Boxes <mark id="count">0</mark><DomainsList/></div>
      <button class="menu-new-button" on:click={() => clearForm()}>+ New</button
      >
    </div>
    <div class="account-body">
      <nav class="menu">
        <NotesList/>
      </nav>
    </div>
  </section>
  <NoteForm/>
{:else}
<section>Please, login!</section>{/if}
