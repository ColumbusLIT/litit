<script>
  import {
    hideLoadingOverlay,
    showLoadingOverlay,
  } from "../../stores/loadingOverlayQueue";
  import { onMount } from "svelte";
  import { user } from "../../stores/user.js";
  import { notes,selectedNote } from "../../stores/notes";
  import NoteItem from "./NoteItem.svelte";
  import { FUNCTIONS } from "../../utilities/client";
  import { ERRORS } from "../../utilities/errors";
  import netlifyIdentity from "netlify-identity-widget";

  let notesValue;
  notes.subscribe((value) => {
    notesValue = value;
  });
  let count = 0;

  function theUserId() {
    if (netlifyIdentity.currentUser() !== null) {
        const localUser = JSON.parse(localStorage.getItem("gotrue.user"));
        return localUser.id;
    } else {
        return false;
    }
    }

  async function getNotes() {
    await fetch(`${FUNCTIONS}/notes?uid=${theUserId()}`, {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        /* Errors */
        if (response.status === 403) {
          throw new Error(ERRORS.AccessDenied);
        } else {
          console.log(JSON.stringify(response));
          throw new Error(ERRORS.UnknownError);
        }
      })
      .then((data) => {
        if (data.length !== 0) {
          notes.set(data);
        }
      })
      .catch((error) => {
        if (error === ERRORS.SessionExpired) {
          alert("Your session expired. Please, login again.");
        }
        if (error === ERRORS.UnknownError) {
          alert(
            "Unknown Error. Try reloading the page or login out and in again."
          );
        }
      })
      .finally(() => {
        console.log('all done')
      });
  }

  onMount(()=>getNotes());

  function setNote(id) {
    console.log(id, notes.find(n => n.id === id));
    selectedNote.set(notes.find(n => n.id === id));
  }

</script>

<div class="notes">
  {#if notesValue}
    {#each notesValue as note}
      <NoteItem {...note} on:selected={setNote} />
    {/each}
  {/if}
</div>

<style>
  .notes {
    margin: 0;
  }
</style>
